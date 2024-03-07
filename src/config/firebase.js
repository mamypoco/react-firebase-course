import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBizOC_CYMvkfBF816AxLhoIKnrtpuXmno",
  authDomain: "fir-course-pedro-6d036.firebaseapp.com",
  projectId: "fir-course-pedro-6d036",
  storageBucket: "fir-course-pedro-6d036.appspot.com",
  messagingSenderId: "779267829516",
  appId: "1:779267829516:web:e7d8bd64b0edfc4568e329",
  measurementId: "G-5K0KCVR124",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
//db creation
export const db = getFirestore(app);
//storages creation
export const storage = getStorage(app);
