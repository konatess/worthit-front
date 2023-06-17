import { Alert } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, push, get, remove, onValue } from 'firebase/database';
import Strings from '../constants/Strings';

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
    createId: () => {
        return push(ref(db, `users`)).key
    },
    getAllIngAndRec: (uid, callback) => {
        get(ref(db, `users/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val())
            } else {
                callback(null)
            }
        }).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    },
    overwriteAllIngAndRec: (uid, dataObj) => {
        Promise.all([
            set(ref(db, `users/${uid}/ingredients`), dataObj.ingredients),
            set(ref(db, `users/${uid}/recipes`), dataObj.recipes)
        ])
    },
    newIngredient: (uid, ing) => {
        push(ref(db, `users/${uid}/ingredients`), ing).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    },
    updateIngredient: (uid, ingId, ing) => {
        set(ref(db, `users/${uid}/ingredients/${ingId}`), ing).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    }, 
    updateIRCrossRef: (uid, ingId, recId, inUse) => {
        set(ref(db, `users/${uid}/ingredients/${ingId}/recipes/${recId}`), (inUse || null)).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    },
    deleteIngredient: (uid, ingId) => {
        remove(ref(db, `users/${uid}/ingredients/${ingId}`)).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    },
    deleteAllIngredients: (uid) => {
        remove(ref(db, `users/${uid}/ingredients`));
    },
    newRecipe: (uid, rec) => {
        return push(ref(db, `users/${uid}/recipes`), rec).then(newRef => newRef.key).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    },
    updateRecipe: (uid, recId, rec) => {
        set(ref(db, `users/${uid}/recipes/${recId}`), rec).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    },
    deleteRecipe: (uid, recId) => {
        remove(ref(db, `users/${uid}/recipes/${recId}`)).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    },
    deleteAllRecipes: (uid) => {
        remove(ref(db, `users/${uid}/recipes`)).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message));
    },
    deleteAllUserData: (uid) => {
        remove(ref(db, `users/${uid}`)).catch(error => Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, error.message))
    }
}

export default { app, db, dbMethods }