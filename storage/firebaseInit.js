import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, push, remove, onValue } from 'firebase/database';
import Notify from '../components/Notify';

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
    listen: {
        ing: (uid, callback) => {
            onValue(ref(db, `users/${uid}/ingredients`), (snapshot) => {
                if (snapshot.exists()) {
                    callback(snapshot.val());
                }
            })
        },
        rec: (uid, callback) => {
            onValue(ref(db, `users/${uid}/recipes`), (snapshot) => {
                if (snapshot.exists()) {
                    callback(snapshot.val());
                }
            })
        }
    },
    newIngredient: (uid, ing) => {
        push(ref(db, `users/${uid}/ingredients`), ing).catch(error => Notify.showError(Strings.util.languages[0],error.message));
    },
    updateIngredient: (uid, ingId, ing) => {
        set(ref(db, `users/${uid}/ingredients/${ingId}`), ing).catch(error => Notify.showError(Strings.util.languages[0], error.message));
    }, 
    updateIRCrossRef: (uid, ingId, recId, inUse) => {
        set(ref(db, `users/${uid}/ingredients/${ingId}/recipes/${recId}`), (inUse || null)).catch(error => Notify.showError(Strings.util.languages[0], error.message));
    },
    deleteIngredient: (uid, ingId) => {
        remove(ref(db, `users/${uid}/ingredients/${ingId}`)).catch(error => Notify.showError(Strings.util.languages[0], error.message));
    },
    deleteAllIngredients: (uid) => {
        remove(ref(db, `users/${uid}/ingredients`));
    },
    newRecipe: (uid, rec) => {
        return push(ref(db, `users/${uid}/recipes`), rec).then(newRef => newRef.key).catch(error => Notify.showError(Strings.util.languages[0], error.message));
    },
    updateRecipe: (uid, recId, rec) => {
        set(ref(db, `users/${uid}/recipes/${recId}`), rec).catch(error => Notify.showError(Strings.util.languages[0], error.message));
    },
    deleteRecipe: (uid, recId) => {
        remove(ref(db, `users/${uid}/recipes/${recId}`)).catch(error => Notify.showError(Strings.util.languages[0], error.message));
    },
    deleteAllRecipes: (uid) => {
        remove(ref(db, `users/${uid}/recipes`));
    },
}

export default { app, db, dbMethods }