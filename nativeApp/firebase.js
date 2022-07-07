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
    apiKey: 'AIzaSyCB3eqMf02L6kH_F7MAuwXUQVd1dFZfVFQ',
    authDomain: 'mobiletracking-cd8f2.firebaseapp.com',
    databaseURL: 'https://mobiletracking-cd8f2.firebaseio.com',
    projectId: 'mobiletracking-cd8f2',
    storageBucket: 'mobiletracking-cd8f2.appspot.com',
    messagingSenderId: '448981545000',
    appId: '1:448981545000:web:14011a88c4a6079456051d',
    measurementId: 'G-M9EEMS9J5G',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage, app }
