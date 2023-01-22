import { useContext, useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable, KeyboardAvoidingView, Alert } from "react-native";
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import { signInWithEmailAndPassword } from 'firebase/app';
import { getAuth, FacebookAuthProvider, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import { app } from '../storage/firebaseInit';
import LoginButton from "../components/LoginBtn";
import { containers, textStyles, inputStyles, buttonStyles } from "../constants/Styles";
import Strings from "../constants/Strings";
import { UserContext } from "../constants/UserContext";
import Icons from "../constants/Icons";

const auth = getAuth(app)

export default function LoginScreen ({ navigation, route }) { 
	const { settings } = route.params;
    const { user, setUser } = useContext(UserContext);
    const [prefLogin, setPrefLogin] = useState(settings.login || Strings.util.logins[0]);
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    
    const [fRequest, fResponse, fPromptAsync] = Facebook.useAuthRequest({
        responseType: ResponseType.Token,
        clientId: '820229395830871',
        redirectUri: 'https://auth.expo.io/@buddingapps/worthit'
    });
    
    useEffect(() => {
        if (fResponse?.type === 'success') {
            const { access_token } = fResponse.params;
            const credential = FacebookAuthProvider.credential(access_token);
            // Sign in with the credential from the Facebook user.
            signInWithCredential(auth, credential)
            .then(userCredential => console.log(`FB signin userCredential: ${JSON.stringify(userCredential)}`))
            .catch(async (error) => {
                if (error.code === "auth/account-exists-with-different-credential") {
                    // console.log(credential)
                    // console.log(error.customData.email)
                    Alert.alert(Strings.English.headers.errorAlert, JSON.stringify(error), [
                        {
                            text: Strings.English.buttons.cancel, 
                            style: "cancel"
                        },
                        {
                            text: Strings.English.buttons.signInGoogle,
                            onPress: () => gPromptAsync()
                        }
                    ])
                } else {
                    Alert.alert(error.message)
                }})
        }
    }, [fResponse]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            return user ? setUser(user) : setUser({uid: ""})
        })
    }, [])

    
    const [gRequest, gResponse, gPromptAsync] = Google.useIdTokenAuthRequest(
        {
            clientId: '383268290551-h0k4mfj02umgmc9o1rv1deglt53bpnv3.apps.googleusercontent.com',
        },
    );
  
    useEffect(() => {
      if (gResponse?.type === 'success') {
        const { id_token } = gResponse.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential);
      }
    }, [gResponse]);

    // const emailSignin = () => {
    //     let auth;
    //     if (getApps().length > 0) {
    //         auth = getAuth(getApp())
    //     } else {
    //         console.log("No apps found")
    //     }
    //     signInWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         // Signed in 
    //         const user = userCredential.user;
    //         // ...
    //     })
    //     .catch((error) => {
    //         console.log(`Email login error: code: ${error.code} \n message: ${error.message}`)
    //     });
    // }

    return (
        <SafeAreaView style={[containers.safeArea, containers.logins]}>
            <Text style={textStyles.labelText}>{Strings.English.label.login}</Text>
            {prefLogin === Strings.util.logins[4] && <KeyboardAvoidingView style={containers.loginInputs}>
                <TextInput 
                    style={inputStyles.loginField} 
                    placeholder={Strings.English.placeholder.email}
                    autoComplete="email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChange={text => setEmail(text)}
                />
                <TextInput 
                    style={inputStyles.loginField} 
                    placeholder={Strings.English.placeholder.password}
                    autoComplete="password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChange={text => setPassword(text)}
                />
                <Pressable style={[buttonStyles.loginButton, buttonStyles.loginWithEmail]} onPress={() => emailSignin()}>
                    <Text style={textStyles.buttonText}>{Strings.English.buttons.loginWithEmail}</Text>
                </Pressable>
            </KeyboardAvoidingView>}
            {prefLogin !== Strings.util.logins[4] && <>
            {(prefLogin === Strings.util.logins[1] || prefLogin === Strings.util.logins[2]) && <LoginButton 
                iconName={Icons.facebook}
                onPress={() => { fPromptAsync() }}
            />}
            {(prefLogin === Strings.util.logins[1] || prefLogin === Strings.util.logins[3]) && <LoginButton 
                iconName={Icons.google}
                onPress={() => { gPromptAsync() }}
            />}
            </>}
            {/* <LoginButton 
                iconName={Icons.email}
                onPress={() => {setUseEmail(!useEmail)}}
            /> */}
        </SafeAreaView>
    )
}