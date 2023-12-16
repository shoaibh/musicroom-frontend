// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBHjobCrP8mTSBfW-gsN5ky0PWialJf5iU',
    authDomain: 'musicroom-14adf.firebaseapp.com',
    projectId: 'musicroom-14adf',
    storageBucket: 'musicroom-14adf.appspot.com',
    messagingSenderId: '267719498384',
    appId: '1:267719498384:web:938f295284ee086841d615',
    measurementId: 'G-YP1R1N4JB4'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage();
