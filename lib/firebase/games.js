import { collection, getDocs, doc, getDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from './init';

export const getGames = async () => {
  if (!db) return [];
  
  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
};

export const getGame = async (id) => {
  if (!db) return null;
  
  try {
    const gameRef = doc(db, 'games', id);
    const snapshot = await getDoc(gameRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
};

export const addGameToFirestore = async (game) => {
  if (!db) return null;
  
  try {
    const gamesRef = collection(db, 'games');
    const docRef = await addDoc(gamesRef, game);
    return {
      id: docRef.id,
      ...game
    };
  } catch (error) {
    console.error('Error adding game:', error);
    return null;
  }
};