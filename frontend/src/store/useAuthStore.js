import { create } from 'zustand';
import { signOut, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../service/firebase';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  isCheckingAuth: false,

  // ✅ Handles login with Google and backend registration
  login: async () => {
    set({ isLoggingIn: true });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send user to your backend
      const response = await axios.post(`${BASE_URL}/newUser`, {
        name: user.displayName,
        email: user.email,
      });

      // Save returned user data
      set({ authUser: response.data });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          console.log('User already exists.');
        } else if (error.response.status === 400) {
          console.log('Missing name or email.');
        } else {
          console.log('Server error:', error.response.data.message);
        }
      } else {
        console.log('Login or registration failed:', error.message);
      }
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ Check Firebase auth state
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const userData = {
            name: user.displayName,
            email: user.email,
          };
          set({ authUser: userData });
          resolve(userData);
        } else {
          set({ authUser: null });
          resolve(null);
        }
        set({ isCheckingAuth: false });
        unsubscribe();
      });
    });
  },

  // ✅ Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase logout error:', error.message);
    } finally {
      set({ authUser: null });
    }
  },
}));