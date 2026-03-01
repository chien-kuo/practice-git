import { useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  setDoc, 
  serverTimestamp, 
  getDocs, 
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useStore } from '../store/useStore';
import { APP_ID, PUBLIC_COLLECTION } from '../utils/constants';

export const useSurvey = () => {
  const { user, setDataList, setLoading, setError } = useStore();

  useEffect(() => {
    if (!user) return;

    setError(null);
    setLoading(true);

    const collectionRef = collection(
      db, 
      'artifacts', APP_ID, 'public', 'data', PUBLIC_COLLECTION
    );

    const q = query(collectionRef, orderBy('houseNumber', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDataList(loadedData);
      setLoading(false);
    }, (error) => {
      console.error("Snapshot Error:", error);
      setError("系統尚未開放");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, setDataList, setLoading, setError]);

  const submitOpinion = async (houseNumber: number, opinion: string) => {
    if (!user) throw new Error("User not authenticated");
    
    const docId = `house_${houseNumber}`;
    const docRef = doc(
      db, 
      'artifacts', APP_ID, 'public', 'data', PUBLIC_COLLECTION, 
      docId
    );

    await setDoc(docRef, {
      houseNumber,
      opinion: opinion.trim(),
      updatedAt: serverTimestamp(),
      updatedBy: user.uid
    });
  };

  const clearAllData = async () => {
    const collectionRef = collection(
      db, 
      'artifacts', APP_ID, 'public', 'data', PUBLIC_COLLECTION
    );
    const snapshot = await getDocs(collectionRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  };

  const deleteSelected = async (ids: string[]) => {
    const batch = writeBatch(db);
    ids.forEach(id => {
      const docRef = doc(
        db, 
        'artifacts', APP_ID, 'public', 'data', PUBLIC_COLLECTION, 
        id
      );
      batch.delete(docRef);
    });
    await batch.commit();
  };

  return { submitOpinion, clearAllData, deleteSelected };
};
