import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc, getDocs, deleteDoc, query, orderBy, limit } from "firebase/firestore";
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

// ─── Reading history (subcollection: users/{uid}/readings) ──────────────────

export interface FirestoreReading {
  id: string;
  type: string;
  title: string;
  date: number;
  content: string;
  meta?: Record<string, unknown>;
}

export async function saveReadingToFirestore(uid: string, reading: FirestoreReading): Promise<void> {
  try {
    await addDoc(collection(db, "users", uid, "readings"), reading);
  } catch (e) {
    console.error("[Firestore] saveReading error", e);
  }
}

export async function getReadingsFromFirestore(uid: string, max = 50): Promise<FirestoreReading[]> {
  try {
    const q = query(
      collection(db, "users", uid, "readings"),
      orderBy("date", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as FirestoreReading);
  } catch {
    return [];
  }
}

export async function clearReadingsFromFirestore(uid: string): Promise<void> {
  try {
    const snap = await getDocs(collection(db, "users", uid, "readings"));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
  } catch (e) {
    console.error("[Firestore] clearReadings error", e);
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
