import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import {
    getAuth,
    onAuthStateChanged,
    FacebookAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import * as Facebook from 'expo-facebook';

// Optionally import the services that you want to use
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyD5LuF_dEvcv3xcTg3-hIxJ_6Ps_f04YYw',
  authDomain: 'worth-888.firebaseapp.com',
  databaseURL: 'https://worth-888-default-rtdb.firebaseio.com/',
  projectId: 'worth-888',
//   storageBucket: 'project-id.appspot.com',
//   messagingSenderId: 'sender-id',
//   appId: 'app-id',
//   measurementId: 'G-measurement-id',
};

let myApp = initializeApp(firebaseConfig);
const auth = getAuth(myApp);

onAuthStateChanged(auth, user => {
    if (user != null) {
      console.log('We are authenticated now!');
    }
  
    // Do other things
});

async function loginWithFacebook() {
    await Facebook.initializeAsync('<FACEBOOK_APP_ID>');
  
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
    });
  
    if (type === 'success') {
        // Build Firebase credential with the Facebook access token.
        const facebookAuthProvider = new FacebookAuthProvider();
        const credential = facebookAuthProvider.credential(token);
    
        // Sign in with credential from the Facebook user.
        signInWithCredential(auth, credential).catch(error => {
            // Handle Errors here.
        });
    }
}