import { initializeApp } from 'firebase/app';
import {
  getDoc,
  getDocs,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from 'firebase/firestore';
import AppConfiguration from '../config';

initializeApp(AppConfiguration.firebaseConfig);
const db = getFirestore();
export {
  db,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
};
