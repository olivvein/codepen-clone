import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import Image from "next/image";

export default function ImageList() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        axios.get("/api/listImages")
            .then(response => {
                const imagesWithUrl = response.data.map((image: string) => "http://localhost:3000/images/" + image);
                setImages(imagesWithUrl);
            })
            .catch(error => console.error(error));
    }, []);

    const handleClick = (image: SetStateAction<string | null>) => {
        setSelectedImage(image);
    }

    const handleClose = () => {
        setSelectedImage(null);
    }

    const handleImageClick = async () => {
        try {
            await navigator.clipboard.writeText(selectedImage?.toString() || "");
            console.log('Image url copied to clipboard');
        } catch (err) {
            console.error('Failed to copy image url: ', err);
        }
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div key={index} onClick={() => handleClick(image)}>
                        <Image src={image} alt="" className="object-cover h-48 w-full cursor-pointer" width="200" height="200"/>
                    </div>
                ))}
            </div>
            {selectedImage && (
                <div className="absolute z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-full pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Image src={selectedImage} alt="" className="object-cover h-48 w-full" width="200" height="200" onClick={handleImageClick}/>
                                        <p className="text-black">{selectedImage} </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleClose}>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}