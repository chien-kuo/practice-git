import { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useStore } from '../store/useStore';

/**
 * Hook to initialize and maintain the Firebase Auth listener.
 * Should be called once at the top level (e.g., App.tsx).
 */
export const useAuthListener = () => {
  const { setUser, setIsAdmin, setError } = useStore();

  useEffect(() => {
    if (!auth) {
      setError("Firebase Auth 未初始化");
      return;
    }

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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setIsAdmin(!user.isAnonymous);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setIsAdmin, setError]);
};

/**
 * Hook to access auth actions like login and logout.
 */
export const useAuth = () => {
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

