import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import { initializeApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { Button } from 'react-native';

// Optionally import the services that you want to use
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
let myApp = initializeApp({
    apiKey: "AIzaSyD5LuF_dEvcv3xcTg3-hIxJ_6Ps_f04YYw",
    authDomain: "worth-888.firebaseapp.com",
    databaseURL: "https://worth-888-default-rtdb.firebaseio.com",
    projectId: "worth-888",
    storageBucket: "worth-888.appspot.com",
    messagingSenderId: "383268290551",
    appId: "1:383268290551:web:c951118a22bcf2404778f2",
    measurementId: "G-HQS6MR5BT6"
  });

  WebBrowser.maybeCompleteAuthSession();

  export default function LoginButton() {
    const [request, response, promptAsync] = Facebook.useAuthRequest({
        responseType: ResponseType.Token,
        clientId: '820229395830871',
        redirectUri: 'https://auth.expo.io/@buddingapps/worthit'
    });
  
    useEffect(() => {
      if (response?.type === 'success') {
        const { access_token } = response.params;
        const auth = getAuth(myApp);
        const provider = new FacebookAuthProvider();
        const credential = provider.credential(access_token);
        // Sign in with the credential from the Facebook user.
        signInWithCredential(auth, credential);
      }
    }, [response]);
  
    return (
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();}}
      />
    );
  }