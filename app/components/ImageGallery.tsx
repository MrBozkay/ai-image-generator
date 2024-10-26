import Image from 'next/image'

type ImageData = {
  id: string
  url: string
  prompt: string
}

export function ImageGallery({ images }: { images: ImageData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative aspect-square">
          <Image
            src={image.url}
            alt={image.prompt}
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
            <p className="text-sm truncate">{image.prompt}</p>
          </div>
        </div>
      ))}
    </div>
  )
}