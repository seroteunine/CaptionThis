import { useState, useEffect } from 'react';

function ImageComponent({ arrayBuffer }: { arrayBuffer: ArrayBuffer }) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (arrayBuffer) {
            const blob = new Blob([arrayBuffer]);
            const url = URL.createObjectURL(blob);

            setImageUrl(url);

            // Cleanup
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [arrayBuffer]);

    return (
        <div>
            {imageUrl && <img className='w-1/4 h-auto' src={imageUrl} alt="Loaded from ArrayBuffer" />}
        </div>
    );
}

export default ImageComponent;