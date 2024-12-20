'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { models } from "@/lib/models"

type GenerationParams = {
  prompt: string;
  negativePrompt: string;
  numInferenceSteps: number;
  guidanceScale: number;
  model: string;
}

export function ImageGenerationForm({ onSubmit, selectedModel, selectedPrompt }: { 
  onSubmit: (params: GenerationParams) => void,
  selectedModel: string,
  selectedPrompt: string 
}) {
  const { toast } = useToast();

  const [params, setParams] = useState<GenerationParams>({
    prompt: '',
    negativePrompt: 'blurry, bad quality, distorted',
    numInferenceSteps: 45,
    guidanceScale: 7,
    model: selectedModel
  });

  useEffect(() => {
    setParams(prev => ({ ...prev, model: selectedModel }));
  }, [selectedModel]);

  useEffect(() => {
    if (selectedPrompt) {
      setParams(prev => ({ ...prev, prompt: selectedPrompt }));
    }
  }, [selectedPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }
    onSubmit(params);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          value={params.prompt}
          placeholder="a photo of an astronaut riding a horse on mars"
          className="min-h-[100px]"
          onChange={(e) => setParams({ ...params, prompt: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="negativePrompt">Negative Prompt</Label>
        <Input
          id="negativePrompt"
          placeholder="blurry, bad quality, distorted"
          value={params.negativePrompt}
          onChange={(e) => setParams({ ...params, negativePrompt: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numInferenceSteps">Number of Inference Steps</Label>
          <Slider
            id="numInferenceSteps"
            min={10}
            max={150}
            step={1}
            value={[params.numInferenceSteps]}
            onValueChange={(value) => setParams({ ...params, numInferenceSteps: value[0] })}
          />
          <span className="text-sm text-muted-foreground">{params.numInferenceSteps}</span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="guidanceScale">Guidance Scale</Label>
          <Slider
            id="guidanceScale"
            min={1}
            max={20}
            step={0.1}
            value={[params.guidanceScale]}
            onValueChange={(value) => setParams({ ...params, guidanceScale: value[0] })}
          />
          <span className="text-sm text-muted-foreground">{params.guidanceScale.toFixed(1)}</span>
        </div>
      </div>
      <Button type="submit" className="w-full">Generate Image</Button>
    </form>
  )
}