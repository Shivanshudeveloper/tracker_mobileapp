import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// const firebaseConfig = {
//   apiKey: 'AIzaSyDGpc3IFaTYM-3CQnF6YHdapasZBcpZrEo',
//   authDomain: 'evencloud-26d32.firebaseapp.com',
//   databaseURL: 'https://evencloud-26d32.firebaseio.com',
//   projectId: 'evencloud-26d32',
//   storageBucket: 'evencloud-26d32.appspot.com',
//   messagingSenderId: '599725599274',
//   appId: '1:599725599274:web:0a3c20e350260df4a1f153',
//   measurementId: 'G-PXGR5P46SP',
// }

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
const analytics = getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, app, storage }
