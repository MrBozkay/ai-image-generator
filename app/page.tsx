'use client'

import { useState, useEffect } from 'react'
import { PromptForm } from './components/PromptForm'
import { ImageGallery } from './components/ImageGallery'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Notifications, useToast } from './components/Notifications'

type ImageData = {
  id: string
  imageUrl: string
  prompt: string
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history?limit=10')
      console.log("response : /n", response)  
      if (!response.ok) throw new Error('Failed to fetch history')
      const data = await response.json()
      
      setImages(data)
    } catch (error) {
      console.error('Error fetching history:', error)
      toast({
        variant: "destructive",
        title: "Error fetching history",
        description: "There was a problem fetching your image history. Please try again.",
      })
    }
  }

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      // check response 
      //console.log("response : /n",response)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate image')
      }

      const newImage: ImageData = await response.json()
      console.log("newImage : /n", newImage)
      setImages(prevImages => [newImage, ...prevImages])
      console.log("images : /n", images)
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">AI Image Generator</h1>
      <PromptForm onSubmit={handleSubmit} />
      {isLoading && <LoadingSpinner />}
      <ImageGallery images={images} />
      <Notifications />
    </div>
  )
}