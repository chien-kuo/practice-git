import { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useStore } from '../store/useStore';

export const useAuth = () => {
  const { setUser, setIsAdmin, setError } = useStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth Error:", err);
        setError("系統尚未開放");
      }
    };
    initAuth();

    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setIsAdmin(!user.isAnonymous);
      } else {
        setIsAdmin(false);
      }
    });
  }, [setUser, setIsAdmin, setError]);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error("Login Failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await signInAnonymously(auth);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return { login, logout };
};
