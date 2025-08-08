// src/context/UserAuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./firebase";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, Setuser] = useState([]);
  const [notificationEnabled, SetnotificationEnabled] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signin(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth", currentUser);
      Setuser(currentUser);
    });

    return () => Unsubscribe();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        login,
        signin,
        logout,
        googleSignIn,
        resetPassword,
        notificationEnabled,
        SetnotificationEnabled,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
