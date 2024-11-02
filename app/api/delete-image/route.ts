import { NextResponse } from 'next/server';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/app/lib/firebase';
import { errorHandler } from '@/app/lib/errorHandler';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    console.log('Request ID:', id);

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const docRef = doc(db, 'images', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const { filename } = docSnap.data();

    const storageRef = ref(storage, `images/${filename}`);
    await deleteObject(storageRef);

    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting image:', error);
    return errorHandler(error);
  }
}

// Add this OPTIONS handler
export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 200 });
}