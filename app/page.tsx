'use client'

import { useState, useEffect } from 'react'
// import { PromptForm } from './components/PromptForm'
import { ImageGenerationForm } from './components/ImageGenerationForm'
import { ImageGallery } from './components/ImageGallery'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Notifications, useToast } from './components/Notifications'
import { Button } from "@/components/ui/button"
import { initializeModels } from "@/app/lib/models"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from './components/Sidebar'

type ImageData = {
  id: string
  imageUrl: string
  prompt: string
  filename: string
}

type GenerationParams = {
  prompt: string;
  negativePrompt: string;
  numInferenceSteps: number;
  guidanceScale: number;
}

type Model = {
  id: string;
  name: string;
}

export default function Home() {
  
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore,setIsLoadingMore] = useState(false)
  const [nextLastId, setNextLastId] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(15)
  const { toast } = useToast()
  const [allImages, setAllImages] = useState<ImageData[]>([])
  const [displayCount, setDisplayCount] = useState<number>(15)
  const [selectedModel, setSelectedModel] = useState<string>("default")
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")

  useEffect(() => {
    fetchAllImages()
    initializeModels()
  }, [])

  useEffect(() => {
    setImages(allImages.slice(0, displayCount))
  }, [allImages, displayCount])

  const fetchAllImages = async () => {
    try {
      const url = new URL('/api/history', window.location.origin)
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch history')
      const data = await response.json()
      
      setAllImages(data.history)
      setImages(data.history.slice(0, displayCount))
    } catch (error) {
      console.error('Error fetching history:', error)
      toast({
        variant: "destructive",
        title: "Error fetching history",
        description: "There was a problem fetching your image history. Please try again.",
      })
    }
  }

  const handleSubmit = async (params: GenerationParams) => {
    setIsLoading(true)
    try {

      const gen_url = new URL('/api/generate', window.location.origin)
      const response = await fetch(gen_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate image')
      }

      const newImage: ImageData = await response.json()
      console.log("newImage from generate api : /n", newImage)
      setAllImages(prev => [newImage, ...prev])
      setImages(prev => [newImage, ...prev].slice(0, displayCount))
      console.log("images from generate api : /n", images)
      toast({
        title: "Image generated successfully",
        description: "Your image has been created and added to the gallery.",
      })
    } catch (error) {
      console.error('Error generating image:', error)
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: error instanceof Error ? error.message : "There was a problem creating your image. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    try {
      const del_url = new URL('/api/delete-image', window.location.origin)
      const response = await fetch(del_url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        
      })
      console.log(" deleted image : " , id)

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      setAllImages(prev => prev.filter(image => image.id !== id))
      setImages(prev => prev.filter(image => image.id !== id))
      toast({
        title: "Image deleted successfully",
        description: "The image has been removed from your gallery.",
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        variant: "destructive",
        title: "Error deleting image",
        description: "There was a problem deleting the image. Please try again.",
      })
    }
  }


  return (
    <div className="flex">
      <Sidebar 
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        promptHistory={allImages.map(img => img.prompt)}
        onPromptSelect={setSelectedPrompt}
      />
      
      <div className="flex-1 p-8 space-y-8">
        
        <ImageGenerationForm 
          onSubmit={handleSubmit} 
          selectedModel={selectedModel}
          selectedPrompt={selectedPrompt}
        />
        
        <div className="flex justify-end mb-4">
          <Select
            value={displayCount.toString()}
            onValueChange={(value) => setDisplayCount(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Images to display" />
            </SelectTrigger>
            <SelectContent>
              {[6, 15, 30, 50].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  Show {num} images
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && <LoadingSpinner />}
        <ImageGallery images={images} onDelete={handleDeleteImage} />
        
        <div className="flex justify-center">
        
        {images.length === 0 && !isLoading && (
          <div className="text-center text-gray-500">
            <p>No images generated yet.</p>
          </div>
        )}
        {images.length > 0 && nextLastId === null && (
          <div className="text-center text-gray-500">
            <p>No more images to load.</p>
          </div>
        )}

        {nextLastId && images.length > 0 && (
          <Button 
            onClick={() => {
              setSelectedImageIndex(images.length)
              fetchHistory();
              setIsLoadingMore(true);
            }}
            className={`w-1/4 justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoadingMore ? 'hidden' : ''}`}
          >
            Load More Images
          </Button>
        )}
        {isLoadingMore && (
          <Button 
            onClick={() => {
              setIsLoadingMore(false);
              setSelectedImageIndex(6)
              fetchHistory()
              
            }}
            className="w-1/4 justify-center items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Load Less
          </Button>
        )}
        </div>
        <Notifications />
      </div>
    </div>
  )
}