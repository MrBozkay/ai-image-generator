import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/lib/firebase';
import { rateLimiter } from '@/app/lib/rateLimit';
import { errorHandler } from '@/app/lib/errorHandler';
import { models } from '@/app/lib/models';


// Create HuggingFace  token
const hf_token = process.env.HUGGINGFACE_API_KEY;

export async function POST(req: Request) {

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

  try {

    const { prompt, negativePrompt, numInferenceSteps, guidanceScale, model } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }
    console.log('Prompt:', prompt);

    // Find the selected model from the models array
    const selectedModel = models.find(m => m.id === model)?.name || models[0].name;
    
    // Generate image using Hugging Face with selected model
    const response = await fetch(`https://api-inference.huggingface.co/models/${selectedModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hf_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        num_inference_steps: numInferenceSteps,
        negative_prompt: negativePrompt,
        guidance_scale: guidanceScale,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image - no response from API');
    }
    // convert img data
    const result = await response.blob();
    const buffer = await result.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    
    // Generate a unique filename
    const filename = `image-${Date.now()}.jpg`;
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
      filename
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return errorHandler(error);
  }
}

// Add this OPTIONS handler
export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 200 });
}