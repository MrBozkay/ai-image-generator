import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const limitValue = limitParam ? parseInt(limitParam, 10) : 10;

    const q = query(
      collection(db, 'images'),
      orderBy('createdAt', 'desc'),
      limit(limitValue)
    );

    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
    }));
    console.log("history : /n", history)    
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}