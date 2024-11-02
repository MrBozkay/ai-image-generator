import { NextResponse } from 'next/server';

export function errorHandler(error: unknown) {
  console.error('Error:', error);
  
  // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('token seems invalid')) {
        return NextResponse.json(
          { error: 'Invalid API token. Please check your Hugging Face API key.' },
          { status: 401 }
        );

      }
      if (error.message.includes('Could not connect to API')) {
        return NextResponse.json(
          { error: 'Failed to connect to Hugging Face API. Please check your internet connection.' },
          { status: 500 }
        );
      }
      if (error.message.includes('Failed to fetch')) {
        return NextResponse.json(
          { error: 'Failed to fetch data from Hugging Face API. Please try again later.' },
          { status: 500 }
        );
      }
      if (error.message.includes('JSON Parse error')) {
        return NextResponse.json(
          { error: 'Failed to parse data from Hugging Face API. Please try again later.' },
          { status: 500 }
        );
      }
      if (error.message.includes('Unexpected server response')) {
        return NextResponse.json(
          { error: 'Unexpected response from Hugging Face API. Please try again later.' },
          { status: 500 }
        );
      }
    
    }
  
  return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
}
