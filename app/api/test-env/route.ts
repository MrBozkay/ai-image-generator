import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envVars = {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    };

    return NextResponse.json(envVars);
  } catch (error) {
    console.error('Error fetching environment variables:', error);
    return NextResponse.json({ error: 'Failed to fetch environment variables' }, { status: 500 });
  }
}