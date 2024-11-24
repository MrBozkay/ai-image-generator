import { db } from "@/app/lib/firebase"
import { collection, doc,addDoc, setDoc, getDoc ,deleteDoc} from "firebase/firestore";

const modelsCollectionRef = collection(db, "models");
// console.log("modelsCollectionRef:", modelsCollectionRef);

export interface Model {
  id: string;
  name: string;
}

export const initializeModels = async (): Promise<void> => {
  const models = [
    { id: "default", name: "black-forest-labs/FLUX.1-dev" },
    { id: "sd15", name: "runwayml/stable-diffusion-v1-5" },
    { id: "sht3dif", name: "shuttleai/shuttle-3-diffusion" },
    { id: "sdf-3.5-small", name: "stabilityai/stable-diffusion-3.5-small" },
    { id: "sdf-3.5-medium", name: "stabilityai/stable-diffusion-3.5-medium" },
    { id: "sdf-3.5-large", name: "stabilityai/stable-diffusion-3.5-large" },
    { id: "sdf-3.5-large-turbo", name: "stabilityai/stable-diffusion-3.5-large-turbo" },
  ];

  for (const model of models) {
    try {
      const ref=await addDoc(modelsCollectionRef, model);
      if (ref) {
        console.log(`Model  ${model.id} added successfully.`);
      }
    }
    catch (error) {
      console.error(`Error adding model ${model.id}:`, error);
    }
  }
};


// Function to fetch models from Firebase Firestore
export const fetchModels = async (): Promise<Model[]> => {
  try {
    const querySnapshot = await getDocs(modelsCollectionRef);
    const models: Model[] = [];
    querySnapshot.forEach((doc) => {
      const modelData = doc.data() as Model;
      models.push(modelData);
    });
    return models;
  }
  catch(error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};

// Function to add a new model to Firebase Firestore
export const addModel = async (newModel: Model): Promise<void> => {
  try {
    const docRef = await addDoc(modelsCollectionRef, newModel);
    console.log(`Model ${newModel.id} added successfully.`);
  } catch (error) {
    console.error(`Error adding model ${newModel.id}:`, error);
  }
  
};

// Function to delete a model from Firebase Firestore
export const deleteModel = async (modelId: string): Promise<void> => {
  try{
    const modelRef = doc(modelsCollectionRef, modelId);
    await deleteDoc(modelRef);
    if (modelRef) {
      console.log(`Model ${modelId} deleted successfully.`);
    }

  }
  catch(error){
    console.error(`Error deleting model ${modelId}:`, error);
  }
};

// Function to get unique prompts
export const getUniquePrompts = (prompts: string[]): string[] => {
  return [...new Set(prompts)];
};