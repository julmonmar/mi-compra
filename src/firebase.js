import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUhrr-PBjXNcXuYFsH4qLZeZlh0FqKLIs",
  authDomain: "mi-compra-6d19c.firebaseapp.com",
  projectId: "mi-compra-6d19c",
  storageBucket: "mi-compra-6d19c.firebasestorage.app",
  messagingSenderId: "84044665990",
  appId: "1:84044665990:web:a083ac239f7139b1a62d07"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
