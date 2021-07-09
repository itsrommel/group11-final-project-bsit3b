import firebase from "firebase";
const firebaseApp = firebase.initializeApp ({
  apiKey: "AIzaSyCVqNhu1K5rM1Ue5PMDSD0fIIeagJY9rys",
  authDomain: "instabsu-react.firebaseapp.com",
  projectId: "instabsu-react",
  storageBucket: "instabsu-react.appspot.com",
  messagingSenderId: "897525495590",
  appId: "1:897525495590:web:2e2956a6060c6ede5af3e7",
  measurementId: "G-LQQ66PFBRK"
});


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };