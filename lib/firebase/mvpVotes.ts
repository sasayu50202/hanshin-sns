import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./init";
import { MVPVote } from "../../types/firebase";
type VoteInput = {
  gameId: string;
  userId: string;
  userEmail: string;
  playerId: string;
  timestamp: string;
};
export const addVote = async (vote: VoteInput): Promise<MVPVote | null> => {
  if (!db) return null;

  try {
    const votesRef = collection(db, "mvp_votes");
    const existingVoteQuery = query(
      votesRef,
      where("gameId", "==", vote.gameId),
      where("userId", "==", vote.userId)
    );
    const existingVoteSnapshot = await getDocs(existingVoteQuery);

    if (!existingVoteSnapshot.empty) {
      throw new Error("すでにこの試合に投票済みです");
    }

    const docRef = await addDoc(votesRef, vote);
    return {
      id: docRef.id,
      ...vote,
    };
  } catch (error) {
    console.error("Error adding vote:", error);
    throw error;
  }
};

export const getGameVotes = async (gameId: string): Promise<MVPVote[]> => {
  if (!db) return [];

  try {
    const votesRef = collection(db, "mvp_votes");
    const q = query(votesRef, where("gameId", "==", gameId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MVPVote[];
  } catch (error) {
    console.error("Error fetching votes:", error);
    return [];
  }
};
