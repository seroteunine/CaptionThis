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
        <>
            {imageUrl && <img className='grid-image' src={imageUrl} alt="Loaded from ArrayBuffer" />}
        </>
    );
}

export default ImageComponent;