import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchModels,
         addModel,
         deleteModel
 } from "@/app/lib/models"
 
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { 
         PlusCircle,
         PlusSquare,  
} from "lucide-react"

type SidebarProps = {
  selectedModel: string
  onModelSelect: (model: string) => void
  promptHistory: string[]
  onPromptSelect: (prompt: string) => void
}

export function Sidebar({ selectedModel, onModelSelect, promptHistory, onPromptSelect }: SidebarProps) {

  const [models, setModels] = useState([])
  const [newModelName, setNewModelName] = useState("")
  const [newModelId, setNewModelId] = useState("")
  const uniquePrompts = Array.from(new Set(promptHistory))
  const [addtoogle, setAddtoogle] = useState("hidden")

  useEffect(() => {
    const fetchModelsAsync = async () => {
      try {
        const modelsData = await fetchModels();
        setModels(modelsData);
        console.log("Models fetched:", modelsData);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };

    fetchModelsAsync();

    return () => {
        
    };
  }, [models]);

  const handleAddModel = () => {
    if (newModelName && newModelId) {
      try {
        const newModel = { id: newModelId, name: newModelName }
        addModel(newModel)
        setNewModelName("")
        setNewModelId("")
      } catch (error) {
        console.error("Failed to add model:", error)
      }
    }
  }
  const hiddenToogle = () => {
    if (addtoogle === "hidden") {
      setAddtoogle("block")
    } else {
      setAddtoogle("hidden")
    }
  }

  return (
    <div className="w-80 min-h-screen bg-card border-r border-border p-6 flex flex-col gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
        <h3 className="font-semibold text-lg">Models</h3>
        <Button variant="outline" className="w-10 h-10 p-0"
            onClick={hiddenToogle}>
            <PlusCircle className="h-4 w-4" />
        </Button>
        </div>
        
        <div className={`space-y-2 ${addtoogle}`}>
          <Input
            placeholder="Model Name: (org/model-name)"
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
          />
          <Input
            placeholder="Model ID: sdf-3.5-large-turbo"
            value={newModelId}
            onChange={(e) => setNewModelId(e.target.value)}
          />
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleAddModel}
          >
            Add Model
          </Button>
        </div>
        <div className="space-y-2">
          {models.map((model) => (
            <Button
              key={model.id}
              variant={selectedModel === model.id ? "default" : "outline"}
              className="w-full justify-start text-left"
              onClick={() => onModelSelect(model.id)}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{model.name.split('/')[1]}</span>
                <span className="text-xs text-muted-foreground">{model.name.split('/')[0]}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Prompts</h3>
        <ScrollArea className="h-[400px] border rounded-md">
          {uniquePrompts.map((prompt, index) => (
            <div 
              key={index} 
              className="p-3 text-sm border-b last:border-0 hover:bg-accent/50 cursor-pointer"
              onClick={() => onPromptSelect(prompt)}
            >
              {prompt}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
} 