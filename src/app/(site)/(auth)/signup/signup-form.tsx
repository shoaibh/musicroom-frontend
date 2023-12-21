'use client';

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
import { debounce } from '@/lib/utils';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, FormEvent, useCallback, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-hot-toast';
import { storage } from '../../../../../firebaseConfig';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const getBase64 = (img: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

export const SignUpForm: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');

    const checkPassword = useCallback(
        debounce((value) => {
            if (value.length < 8) {
                setPasswordError('Password must be at least 8 characters');
            } else if (!/[A-Z]/.test(value)) {
                setPasswordError('Password must contain at least one capital letter');
                // eslint-disable-next-line
            } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value)) {
                setPasswordError('Password must contain at least one special character');
            } else {
                setPasswordError('');
            }
        }, 300),
        // eslint-disable-next-line
        []
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        if (name === 'password') checkPassword(value);
    };

    const [imageFile, setImageFile] = useState<File>();
    const [imageUrl, setImageUrl] = useState<string>('');

    // eslint-disable-next-line
    const handleSelectedFile = (files: any) => {
        if (files && files[0].size < 10000000) {
            setImageFile(files[0]);
            getBase64(files[0], (url) => {
                setImageUrl(url);
            });
        } else {
            console.log('file too large');
        }
    };

    const [recaptchaValue, setRecaptchaValue] = useState(null);

    // eslint-disable-next-line
    const handleRecaptcha = (value: any) => {
        // Store the reCAPTCHA response in state or use it as needed
        setRecaptchaValue(value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("passwords don't match");
            return;
        }

        try {
            setIsLoading(true);
            setTimeout(() => {}, 3000);
            if (!recaptchaValue) {
                toast.error('reCAPTCHA not verified');
                return;
            }
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
                                break;
                            case 'running':
                                setIsLoading(true);
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
                                    body: JSON.stringify({
                                        ...rest,
                                        image_url: downloadUrl,
                                        recaptchaValue
                                    })
                                }
                            );
                            if (response.status !== 201) {
                                setIsLoading(false);
                                toast.error('Something went wrong');
                            } else {
                                setIsLoading(false);

                                toast.success('Signed Up Successfully');
                                router.push('/signin');
                            }
                        });
                    }
                );
            } else {
                console.error('File not found');
                toast.error(`Something went wrong`);
            }
        } catch (e) {
            toast.error(`Something went wrong, ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form
                onSubmit={(e) => {
                    setIsLoading(true);

                    handleSubmit(e);
                }}>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
                    <CardDescription className="text-center">
                        Create Email and Password
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {/* <SocialButton
                        icon={BsGoogle}
                        onClick={() => signIn('google', { redirect: true, callbackUrl: '/' })}
                    /> */}

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
                    {passwordError && <span className="text-red-500 text-xs">{passwordError}</span>}
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
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <span className="text-red-500 text-xs">passwords don&apos;t match</span>
                    )}
                    <div className=" gap-2 flex items-center min-h-[55px]">
                        <input
                            type="file"
                            name="file-input"
                            id="file-input"
                            className="max-w-[250px]"
                            onChange={(files) => handleSelectedFile(files.target.files)}
                        />
                        {imageUrl && (
                            <div className=" relative w-[55px] h-[55px] rounded-full overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt="user"
                                    className="rounded-full"
                                    objectFit="cover"
                                    objectPosition="50% 50%"
                                    layout="fill"
                                />
                            </div>
                        )}
                    </div>
                    <ReCAPTCHA
                        sitekey="6LeHwTMpAAAAACkl1G2gMl59khTv9TfIurfhk5Y3"
                        onChange={handleRecaptcha}
                    />
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={isLoading}
                        isLoading={isLoading}>
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
