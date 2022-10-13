import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyD5LuF_dEvcv3xcTg3-hIxJ_6Ps_f04YYw",
    authDomain: "worth-888.firebaseapp.com",
    databaseURL: "https://worth-888-default-rtdb.firebaseio.com",
    projectId: "worth-888",
    storageBucket: "worth-888.appspot.com",
    messagingSenderId: "383268290551",
    appId: "1:383268290551:web:c951118a22bcf2404778f2",
    measurementId: "G-HQS6MR5BT6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const db = getDatabase(app, "https://worth-888-default-rtdb.firebaseio.com/");

const dbMethods = {
    newIngredient: (user, ing) => {
        let ingredients = ref(db, `users/${user.uid}/ingredients`)
        console.log(ingredients)
        push(ingredients, ing).catch(error => console.log(error.message));
    }
}

export default { app, db, dbMethods }