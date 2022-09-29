import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import { initializeApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { Button } from 'react-native';

// Initialize Firebase
initializeApp({
  /* Config */
});

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: '<YOUR FBID>',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      const auth = getAuth();
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