import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/firebase-auth'

const firebaseConfig = {
  apiKey: "AIzaSyCGaDtFGPGAlydcP1gKdYFiVcL9fHk2Fos",
  authDomain: "gadol2021.firebaseapp.com",
  databaseURL: "https://gadol2021-default-rtdb.firebaseio.com",
  projectId: "gadol2021",
  storageBucket: "gadol2021.appspot.com",
  messagingSenderId: "92553552217",
  appId: "1:92553552217:web:8b17256a3c223c31a8ec48"
};


// init firebase
firebase.initializeApp(firebaseConfig)

// init firebase services
const projectAuth = firebase.auth()
const projectFirestore = firebase.firestore()

//timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectAuth, projectFirestore, timestamp }