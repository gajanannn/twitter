// src/context/UserAuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebase";

// ✅ Context must be capitalized
const UserAuthContext = createContext();

// ✅ Component function name must start with a capital letter
export function UserAuthContextProvider({ children }) {
  const [user, Setuser] = useState([]);

  // ✅ Correct function names
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signin(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function googleSignIn() {
    const provider = new GoogleAuthProvider(); // ✅ Fixed variable name conflict
    return signInWithPopup(auth, provider);
  }

  // ✅ Valid usage of useEffect in a React Component
  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth", currentUser);
      Setuser(currentUser);
    });

    return () => Unsubscribe();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{ user, login, signin, logout, googleSignIn }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

// ✅ Custom hook must start with "use"
export function useUserAuth() {
  return useContext(UserAuthContext);
}
