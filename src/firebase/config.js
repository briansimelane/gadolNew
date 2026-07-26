import { initializeApp } from 'firebase/app'
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCGaDtFGPGAlydcP1gKdYFiVcL9fHk2Fos",
  authDomain: "gadol2021.firebaseapp.com",
  databaseURL: "https://gadol2021-default-rtdb.firebaseio.com",
  projectId: "gadol2021",
  storageBucket: "gadol2021.appspot.com",
  messagingSenderId: "92553552217",
  appId: "1:92553552217:web:8b17256a3c223c31a8ec48"
};

const app = initializeApp(firebaseConfig)
const projectFirestore = getFirestore(app)
const projectAuth = getAuth(app)
const timestamp = serverTimestamp

export { projectAuth, projectFirestore, timestamp }