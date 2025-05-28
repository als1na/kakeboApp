
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// =====================================================================================
// !! ¡ASEGÚRATE DE QUE ESTOS VALORES SEAN LOS DE TU PROYECTO FIREBASE REAL! !!
// Los encuentras en la consola de Firebase:
// Configuración del proyecto > General > Tus apps > Configuración de SDK.
// =====================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyC3G4A_U-tO-5zPUd7LTXeEnJL804LjkD8",
  authDomain: "kakeboapp.firebaseapp.com",
  projectId: "kakeboapp",
  storageBucket: "kakeboapp.firebasestorage.app",
  messagingSenderId: "1010002346878",
  appId: "1:1010002346878:web:c24cafcc186133cf63292f"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db, GoogleAuthProvider, signInWithPopup, signInAnonymously };

