import dotenv from "dotenv";
dotenv.config();
import * as firebase from "firebase/app";
import * as fbDb from "firebase/database";
const { getDatabase, ref, push, set } = fbDb;

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

const app = firebase.initializeApp(firebaseConfig);

export const pushToFirebase = async (data) => {
  try {
    const database = getDatabase(app);
    const postListRef = ref(database, "wallets");
    const newPostRef = push(postListRef);
    return await set(newPostRef, data);
  } catch (e) {
    console.error(e);
    return null;
  }
};

