import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCbq-yWCPpDjp0KAZJ65liMZSR2Ld4S7kg',
    authDomain: 'students1-34398.firebaseapp.com',
    projectId: 'students1-34398',
    storageBucket: 'students1-34398.firebasestorage.app',
    messagingSenderId: '220859472633',
    appId: '1:220859472633:web:1503b851db23b6687aa028',
    measurementId: 'G-HH4XS19C2P',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
