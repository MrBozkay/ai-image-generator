import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, startAfter, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { errorHandler } from '@/app/lib/errorHandler';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const lastIdParam = url.searchParams.get('lastId');
    const limitValue = limitParam ? parseInt(limitParam, 10) : 10;

    let q = query(
      collection(db, 'images'),
      orderBy('createdAt', 'desc'),
      limit(limitValue)
    );

    if (lastIdParam) {
      const lastDocRef = await getDocs(query(collection(db, 'images'), limit(1)));
      const lastDoc = lastDocRef.docs[0] as DocumentSnapshot<unknown>;
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
    }));

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length -1];
    const lastId = lastVisible ? lastVisible.id : null;
    console.log("history : /n",history)
    console.log("lastId : /n", lastId)   
    return NextResponse.json({ history, lastId })

  } catch (error) {
    console.error('Error fetching history:', error);
    errorHandler(error);
  }
}