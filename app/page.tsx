'use client'

import { useState, useEffect } from 'react'
// import { PromptForm } from './components/PromptForm'
import { ImageGenerationForm } from './components/ImageGenerationForm'
import { ImageGallery } from './components/ImageGallery'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Notifications, useToast } from './components/Notifications'
import { Button } from "@/components/ui/button"

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

export default function Home() {
  
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore,setIsLoadingMore] = useState(false)
  const [nextLastId, setNextLastId] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(6)
  const { toast } = useToast()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async (lastId?: string) => {
    try {
      console.log('Fetching history with lastId:', lastId)
      console.log('Current images:', images)
      
      const url = new URL('/api/history', window.location.origin)
      url.searchParams.append('limit', selectedImageIndex.toString())
      if (lastId) url.searchParams.append('lastId', lastId)
      
      console.log('Fetching from URL:', url.toString())

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch history')
      const data = await response.json()
      
      console.log('Received data:', data)
      console.log('Received lastId:', data.lastId)
      console.log('Received history length:', data.history.length)
      
      setImages(prevImages => {
        const newImages = lastId ? [...prevImages, ...data.history] : data.history
        console.log('Updated images array:', newImages)
        return newImages
      })
      
      const newNextLastId = data.history.length > 0 ? data.lastId : null
      console.log('Setting nextLastId to:', newNextLastId)
      setNextLastId(newNextLastId)
      
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
      setImages(prevImages => [newImage, ...prevImages])
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

      setImages(prevImages => prevImages.filter(image => image.id !== id))
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">AI Image Generator</h1>
      {/* <PromptForm onSubmit={handleSubmit} /> */}
      <ImageGenerationForm onSubmit={handleSubmit} />
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
            fetchHistory(nextLastId);
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
  )
}