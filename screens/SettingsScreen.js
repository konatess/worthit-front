import { useContext } from "react";
import { SafeAreaView, Linking } from "react-native";
import { getAuth, signOut } from 'firebase/auth';
import { app } from "../storage/firebaseInit"

import ButtonBar from '../components/ButtonBar';
import SettingButton from "../components/SettingButton";
import { containers } from '../constants/Styles';
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import { UserContext } from "../constants/UserContext";


export default function SettingsScreen ({ route, navigation }) {
    const { settings } = route.params;
    const { user, setUser } = useContext(UserContext)
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
            navigation.navigate("Recipe")
        }
    }
    let settingsPress = {
        darkMode: () => {},
        language: () => {},
        dateFormat: () => {},
        delete: () => {},
        feedback: async () => {
            let supported = await Linking.canOpenURL(Strings.util.mailto);
            if (supported) {
                await Linking.openURL(Strings.util.mailto)
            }
            else {
                console.log("Error: " + Strings.util.mailto);
            }
        },
        site: async () => {
            let supported = await Linking.canOpenURL(Strings.util.website);
            if (supported) {
                await Linking.openURL(Strings.util.website)
            }
            else {
                console.log("Error: " + Strings.util.website)
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

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: Colors.lightTheme.background}]}> 
        {settingsBtns.map( button => { return button })}
        <ButtonBar buttons={[cancelBtn, saveBtn]} />
    </SafeAreaView>
}