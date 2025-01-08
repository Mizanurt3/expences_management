import React from 'react';
import Image from 'next/image';
import coverImage from "@/public/images/cover-image.jpg";
export default function Photos() {
    

    return (
        <>
        <h1>Hi</h1>
            <Image src={coverImage} alt="thuumb" />
        </>
    )
}
