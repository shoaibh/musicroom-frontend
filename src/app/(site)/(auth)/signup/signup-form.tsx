'use client';

import SocialButton from '@/components/social-button';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BsGoogle } from 'react-icons/bs';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../firebaseConfig';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const SignUpForm: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const [imageFile, setImageFile] = useState<File>();

    const handleSelectedFile = (files: any) => {
        console.log('==', { files });
        if (files && files[0].size < 10000000) {
            setImageFile(files[0]);

            console.log(files[0]);
        } else {
            console.log('file too large');
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("passwords don't match");
            return;
        }

        try {
            setIsLoading(true);
            const { confirmPassword, ...rest } = formData;
            let downloadUrl = '';
            if (imageFile) {
                let name = imageFile.name;
                name = Date.now() + name;
                const storageRef = ref(storage, `image/${name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        console.error(error.message);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                            //url is download url of file
                            downloadUrl = url;
                            const response = await fetch(
                                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ ...rest, image_url: downloadUrl })
                                }
                            );
                            if (response.status !== 201) {
                                toast.error('Something went wrong');
                            } else {
                                toast.success('Signed Up Successfully');
                                router.push('/signin');
                            }
                        });
                    }
                );
            } else {
                console.error('File not found');
            }
        } catch (e) {
            toast.error(`Something went wrong, ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
                    <CardDescription className="text-center">
                        Create Email and Password
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <SocialButton
                        icon={BsGoogle}
                        onClick={() => signIn('google', { redirect: true, callbackUrl: '/' })}
                    />

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            value={formData.name}
                            onChange={handleChange}
                            id="name"
                            name="name"
                            type="name"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={formData.email}
                            onChange={handleChange}
                            id="email"
                            name="email"
                            type="email"
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            value={formData.password}
                            onChange={handleChange}
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Re-Enter Password</Label>
                        <Input
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            type="file"
                            onChange={(files) => handleSelectedFile(files.target.files)}
                        />{' '}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        Sign Up
                    </Button>
                    <p className="mt-2 text-xs text-center text-gray-700">
                        Already have an account?{' '}
                        <Link className=" text-blue-600 hover:underline" href="/signin">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
};
