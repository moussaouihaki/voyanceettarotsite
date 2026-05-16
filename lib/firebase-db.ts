import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile } from "@/contexts/UserProfileContext";

export type FirestoreUser = UserProfile & {
  uid: string;
  email: string;
  updatedAt?: unknown;
};

export async function getFirestoreUser(uid: string): Promise<FirestoreUser | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data() as FirestoreUser;
  } catch {
    return null;
  }
}

export async function saveFirestoreUser(uid: string, data: Partial<FirestoreUser>): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    ...data,
    uid,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateFirestoreSubscription(uid: string, tier: string): Promise<void> {
  try {
    await updateDoc(doc(db, "users", uid), {
      subscription: tier,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("[Firestore] updateSubscription error", e);
  }
}

export async function getUserByEmail(email: string): Promise<FirestoreUser | null> {
  try {
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const q = query(collection(db, "users"), where("email", "==", email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as FirestoreUser;
  } catch {
    return null;
  }
}
