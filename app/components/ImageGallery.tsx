'use client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ImageModal } from './ImageModal'
import { useState } from 'react';
// import { useNonce } from "../utils/useNonce.ts"

type ImageData = {
  id: string
  imageUrl: string
  prompt: string
  filename: string
};

export function ImageGallery({ images, onDelete }: { images: ImageData[], onDelete: (id: string) => void }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
 // const nonce = useNonce()

/*   useEffect(() => {
    if (nonce) {
      const script = document.createElement('script')
      script.nonce = nonce
      script.textContent = 'console.log("Dynamic script with nonce")'
      document.body.appendChild(script)
    }
  }, [nonce]) */

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative aspect-square">
            <Image
              src={image.imageUrl}
              alt={image.prompt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(index)}
            />
            <div className="absolute top-2 right-2  w-10 h-10  bg-white bg-opacity-20 opacity-70 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-md">
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the image click
                  onDelete(image.id);
                 
                }}
                className="absolute bg-slate-200" >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
              <p className="text-sm truncate">{image.prompt}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedImageIndex !== null && (
        <ImageModal
          isOpen={true}
          onClose={closeModal}
          imageUrl={images[selectedImageIndex].imageUrl}
          prompt={images[selectedImageIndex].prompt}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  )
}