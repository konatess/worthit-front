import { useContext, useState, useEffect } from "react";
import { Platform, SafeAreaView, StatusBar, Text, View } from "react-native";
import { containers, textStyles } from "../constants/Styles";
import { SettingsContext } from "../constants/SettingsContext";
import { UserContext } from "../constants/UserContext";
import { Entitlements } from "../constants/EntitlementsContext";
import ButtonBar from "../components/ButtonBar";
import Strings from "../constants/Strings";
import Colors from "../constants/Colors";
import Icons from "../constants/Icons";

export default function BreakEvenScreen ({ route, navigation }) {
	const { settingsObj } = useContext(SettingsContext)
    const { user } = useContext(UserContext);
    const { entitlements } = useContext(Entitlements);
    const [keyboardOut, setKeyboardOut] = useState(false);

    Platform.OS === 'android' && useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardOut(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardOut(false);
        });
    
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [])

    let cancelBtn = {
        title: Strings.English.buttons.cancel,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.cancel : Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.pop()
        },
        darkMode: settingsObj.darkMode
    }
    let saveBtn = {
        title: Strings.English.buttons.save,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.save : Colors.lightTheme.buttons.save,
        iconName: Icons.save,
        onPress: () => {
            console.log("Save Button")
        },
        darkMode: settingsObj.darkMode
    }

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: settingsObj.darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        <StatusBar 
            barStyle={settingsObj.darkMode ? 'light-content' : 'dark-content'}
        />
        {Platform.OS === 'android' && <View style={{height: StatusBar.currentHeight}} />}
        <Text style={[textStyles.headerText, {color: settingsObj.darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{Strings.English.headers.breakEven}</Text>
        {!keyboardOut && <ButtonBar buttons={[  cancelBtn, saveBtn ]} />}
    </SafeAreaView>
}