import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth" // New import
import { getDatabase } from "firebase/database";

//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";

// Configurações do Firebase. Outra pessoa não pode acessar, então usamos
// variáveis locais em um .env.local para que fiquem só na minha máquina
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

const firebase = initializeApp(firebaseConfig);

const auth = getAuth(firebase);
const database = getDatabase(firebase);

export { auth, database, GoogleAuthProvider, signInWithPopup }