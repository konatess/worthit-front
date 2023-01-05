import { useContext, useState } from "react";
import { SafeAreaView, Linking } from "react-native";
// import * as Linking from "expo-linking"
import { getAuth, signOut } from 'firebase/auth';
import { app } from "../storage/firebaseInit"
import ButtonBar from '../components/ButtonBar';
import SettingButton from "../components/SettingButton";
import { containers } from '../constants/Styles';
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import Notify from "../components/Notify";
import { UserContext } from "../constants/UserContext";
import { storeSettings } from "../storage/localAsync";


export default function SettingsScreen ({ route, navigation }) {
    const { settings } = route.params;
    const { user, setUser } = useContext(UserContext);
    const [darkMode, setDarkMode] = useState(settings.darkMode || false);
    const [currency, setCurrency] = useState(settings.currency || Strings.util.currencies[0]);
    const [language, setLanguage] = useState(settings.language || Strings.util.languages[0]);
    const [prefLogin, setPrefLogin] = useState(settings.login || Strings.util.logins[0]);
    const [decimalLength, setDecimalLength] = useState(settings.decimalLength || 2)

    let cancelBtn = {
        title: "Cancel",
        color: Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.goBack()
        }
    }
    let saveBtn = {
        title: "Save",
        color: Colors.lightTheme.buttons.save,
        iconName: Icons.save,
        onPress: () => {
            let obj = {
                darkMode: darkMode, 
                currency: currency, 
                language: language, 
                login: prefLogin,
                decimalLength: decimalLength
            }
            console.log("Save Button")
            storeSettings(obj);
            navigation.navigate(Strings.util.routes.home)
        }
    }
    let settingsPress = {
        darkMode: () => {
            setDarkMode(!darkMode)
        },
        currency: () => {},
        language: () => {},
        deleteIng: () => {},
        deleteRec: () => {},
        subscriptions: () => {
            // console.log("Subscriptions")
            Notify.showError("English", Strings.English.buttons.allSettings.subscriptions)
        },
        feedback: async () => {
            let supported = await Linking.canOpenURL(Strings.util.mailto);
            if (supported) {
                await Linking.openURL(Strings.util.mailto)
            }
            else {
                Notify.showError(Strings.util.languages[0], "Error: " + Strings.util.mailto);
            }
        },
        site: async () => {
            let supported = await Linking.canOpenURL(Strings.util.website);
            if (supported) {
                await Linking.openURL(Strings.util.website)
            }
            else {
                Notify.showError(Strings.util.languages[0],"Error: " + Strings.util.website)
            }
        },
        logout: () => {
            let auth = getAuth(app)
            signOut(auth).then(setUser({uid: ""}))
        }
    }
    let settingsBtns = [];
    for (const property in Strings.English.buttons.allSettings) {
        let button = <SettingButton 
            key={property}
            title={Strings.English.buttons.allSettings[property]}
            iconName={Icons[property]}
            onPress={settingsPress[property]}
        />
        settingsBtns.push(button)
    }

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        {settingsBtns.map( button => button )}
        <ButtonBar buttons={[cancelBtn, saveBtn]} />
    </SafeAreaView>
}