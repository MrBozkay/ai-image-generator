import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/lib/firebase';
import { rateLimiter } from '@/app/lib/rateLimit';
import { errorHandler } from '@/app/lib/errorHandler';
// Create huggingface models list
const models: { [key: string]: string } = {

  'stable-diffusion-v2' :'stabilityai/stable-diffusion-2',
  'flux.1-lite-8b' : 'Freepik/flux.1-lite-8B-alpha',
  'FLUX.1-dev' : 'black-forest-labs/FLUX.1-dev',
  'stable-diffusion-3.5-large' : 'stabilityai/stable-diffusion-3.5-large',
  'stable-diffusion-3.5-large-turbo' : 'stabilityai/stable-diffusion-3.5-large-turbo',
}


// Create HuggingFace inference instance
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    // Validate API key exists
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error('HUGGINGFACE_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimiter(ip);

    if (rateLimitResult) {
        return rateLimitResult;
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    console.log('Prompt:', prompt);
    console.log('Using model:',models["stable-diffusion-3.5-large-turbo"]);

    // Generate image using Hugging Face
    const response = await hf.textToImage({
      model: models["stable-diffusion-3.5-large-turbo"],
      inputs: prompt,
      parameters: {
        negative_prompt: 'blurry, bad quality, low resolution',
      },
    });

    if (!response) {
      throw new Error('Failed to generate image - no response from API');
    }

    // Convert blob to base64
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    /// Generate a unique filename
    const filename = `${Date.now()}.jpg`;

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `images/${filename}`);
    await uploadString(storageRef, dataUrl, 'data_url');
    const imageUrl = await getDownloadURL(storageRef);

    // Save prompt, image URL, and filename to Firestore
    const docRef = await addDoc(collection(db, 'images'), {
      prompt,
      imageUrl,
      filename,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
        id: docRef.id, 
        imageUrl,
        prompt,
        filename });

  } catch (error) {
    console.error('Error generating image:', error);
    errorHandler(error)
  }
}