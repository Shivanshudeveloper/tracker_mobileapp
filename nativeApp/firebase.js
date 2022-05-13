// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDGpc3IFaTYM-3CQnF6YHdapasZBcpZrEo',
  authDomain: 'evencloud-26d32.firebaseapp.com',
  databaseURL: 'https://evencloud-26d32.firebaseio.com',
  projectId: 'evencloud-26d32',
  storageBucket: 'evencloud-26d32.appspot.com',
  messagingSenderId: '599725599274',
  appId: '1:599725599274:web:0a3c20e350260df4a1f153',
  measurementId: 'G-PXGR5P46SP',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage, app }
