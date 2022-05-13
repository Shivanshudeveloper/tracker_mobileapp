// import firebase from "firebase/app";
// import "firebase/storage";
// import "firebase/database";
// import "firebase/auth";
// import "firebase/messaging";
// import "firebase/analytics";
// import "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBSEx2-ykPTb70keLZh3LAuDtQT2VyCsco",
//   authDomain: "evencloud-26d32.firebaseapp.com",
//   databaseURL: "https://evencloud-26d32.firebaseio.com",
//   projectId: "evencloud-26d32",
//   storageBucket: "evencloud-26d32.appspot.com",
//   messagingSenderId: "599725599274",
//   appId: "1:599725599274:web:8f9a716ca577fc72a1f153",
//   measurementId: "G-VSJNQ5LYK5"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
// let storage = firebase.storage();
// let database = firebase.database();
// let auth = firebase.auth();
// let firestore = firebase.firestore();
// // Authentication for Google
// var googleProvider = new firebase.auth.GoogleAuthProvider();
// // Authentication for Facebook
// var facebookProvider = new firebase.auth.FacebookAuthProvider();
// // Authentication for Twitter
// var twitterProvider = new firebase.auth.TwitterAuthProvider();
// export {
//   firestore,
//   auth,
//   googleProvider,
//   facebookProvider,
//   twitterProvider,
//   database,
//   storage,
//   firebase as default,
// };

// 8.6.1

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

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
const analytics = getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, app, storage }
