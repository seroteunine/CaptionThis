import { useState, useEffect } from 'react';

function ImageComponent({ arrayBuffer }: { arrayBuffer: ArrayBuffer }) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (arrayBuffer) {
            const blob = new Blob([arrayBuffer]);
            const url = URL.createObjectURL(blob);

            setImageUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [arrayBuffer]);

    return (
        <div className='flex justify-center items-center h-full'>
            {imageUrl && <img className='max-w-md h-auto' src={imageUrl} alt="Loaded from ArrayBuffer" />}
        </div>
    );
}

export default ImageComponent;