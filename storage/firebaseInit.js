import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, push, remove } from 'firebase/database';

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

// const userDbStr = `users/${user.uid}`
const ingStr = "/ingredients"
const recStr = "/recipes"

const dbMethods = {
    newIngredient: (uid, ing) => {
        push(ref(db, `users/${uid}/ingredients`), ing).catch(error => console.log(error.message));
    },
    updateIngredient: (uid, ingId, ing) => {
        set(ref(db, `users/${uid}/ingredients/${ingId}`), ing).catch(error => console.log(error.message));
    },
    deleteIngredient: (uid, ingId) => {
        remove(ref(db, `users/${uid}/ingredients/${ingId}`)).catch(error => console.log(error.message));
    },
    newRecipe: (uid, rec) => {
        push(ref(db, `users/${uid}/recipes`), rec).catch(error => console.log(error.message));
    },
    updateRecipe: (uid, recId, rec) => {
        set(ref(db, `users/${uid}/recipes/${recId}`), rec).catch(error => console.log(error.message));
    },
    deleteRecipe: (uid, recId) => {
        remove(ref(db, `users/${uid}/recipes/${recId}`)).catch(error => console.log(error.message));
    }
}

export default { app, db, dbMethods }