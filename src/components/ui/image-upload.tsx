'use client';

import { useState } from 'react';
import axios from '@/app/libs/axios-config';
import { Input } from './input';

const ImageUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileChange = (event: any) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedImage) return;
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            await axios.post('/user/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <Input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Image</button>
        </div>
    );
};

export default ImageUpload;
