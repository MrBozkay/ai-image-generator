'use client'

import { useState } from 'react'
import { PromptForm } from './components/PromptForm'
import { ImageGallery } from './components/ImageGallery'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Notifications, useToast } from './components/Notifications'

type ImageData = {
  id: string
  url: string
  prompt: string
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      const newImage: ImageData = {
        id: Date.now().toString(),
        url: 'https://source.unsplash.com/random',
        prompt
      }
      setImages(prevImages => [newImage, ...prevImages])
      toast({
        title: "Image generated successfully",
        description: "Your image has been created and added to the gallery.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: "There was a problem creating your image. Please try again.",
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