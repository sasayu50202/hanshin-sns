import { collection, addDoc, getDocs, query, where, Timestamp, limit } from 'firebase/firestore';
import { db } from './init';

const convertTimestamp = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return new Date().toISOString();
};

export const addComment = async (comment) => {
  if (!db) throw new Error('Firestore is not initialized');
  
  try {
    const commentsRef = collection(db, 'comments');
    const timestamp = Timestamp.fromDate(new Date());
    
    const commentData = {
      gameId: comment.gameId,
      userId: comment.userId,
      userEmail: comment.userEmail,
      content: comment.content,
      timestamp,
      likes: 0
    };

    const docRef = await addDoc(commentsRef, commentData);
    
    return { 
      id: docRef.id, 
      ...commentData,
      timestamp: timestamp.toDate().toISOString()
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getGameComments = async (gameId) => {
  if (!db) return [];
  
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef, 
      where('gameId', '==', gameId),
      limit(100)
    );
    
    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        gameId: data.gameId,
        userId: data.userId,
        userEmail: data.userEmail,
        content: data.content,
        timestamp: convertTimestamp(data.timestamp),
        likes: data.likes || 0
      };
    });

    // クライアントサイドでソート
    return comments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};