import { useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import * as Linking from "expo-linking";
import { getAuth, signOut } from 'firebase/auth';
import firebaseInit, { app } from "../storage/firebaseInit"
import ButtonBar from '../components/ButtonBar';
import SettingButton from "../components/SettingButton";
import { containers } from '../constants/Styles';
import Modal from "../components/Modal";
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import Notify from "../components/Notify";
import { UserContext } from "../constants/UserContext";
import { storeSettings, deleteIng, deleteRec } from "../storage/localAsync";


export default function SettingsScreen ({ route, navigation }) {
    const { settings, recLength } = route.params;
    const { user, setUser } = useContext(UserContext);
    const [darkMode, setDarkMode] = useState(settings.darkMode || false);
    const [currency, setCurrency] = useState(settings.currency || Strings.util.currencies[0]);
    const [language, setLanguage] = useState(settings.language || Strings.util.languages[0]);
    const [prefLogin, setPrefLogin] = useState(settings.login || Strings.util.logins[0]);
    const [decimalLength, setDecimalLength] = useState(settings.decimalLength || 2)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtons, setModalButtons] = useState([]);
	const [modalPickers, setModalPickers] = useState([]);
    const [modalInputs, setModalInputs] = useState([]);
    const [modalBtnsVertical, setModalBtnsVertical] = useState(false);

    const closeModal = () => {
        setModalVisible(false);
        setModalMessage("");
        setModalButtons([]);
    }
    
    let cancelBtn = {
        title: "Cancel",
        color: Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.pop()
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
            storeSettings(obj);
            navigation.push(Strings.util.routes.home)
        }
    }

    let modalCancelBtn = {
        title: Strings.English.buttons.cancel,
        color: Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            closeModal();
        }
    }

    let modalDeleteIngBtn = {
        title: Strings.English.buttons.delete,
        color: Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
            closeModal();
            if (prefLogin === Strings.util.logins[0]) {
                deleteIng();
            } else if (prefLogin === !Strings.util.logins[0]) {
                firebaseInit.dbMethods.deleteAllIngredients();
            }
            navigation.pop();
        }
    }

    let modalDeleteRecBtn = {
        title: Strings.English.buttons.delete,
        color: Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
            closeModal();
            if (prefLogin === Strings.util.logins[0]) {
                deleteRec();
            } else if (prefLogin === !Strings.util.logins[0]) {
                firebaseInit.dbMethods.deleteAllRecipes();
            }
            navigation.pop();
        }
    }

    let settingsPress = {
        darkMode: () => {
            setDarkMode(!darkMode)
        },
        currency: () => {},
        language: () => {},
        deleteIng: () => {
            setModalMessage(Strings.English.messages.deleteAllIng);
            setModalButtons([modalDeleteIngBtn, modalCancelBtn])
            setModalVisible(true);
        },
        deleteRec: () => {
            setModalMessage(Strings.English.messages.deleteAllRec);
            setModalButtons([modalDeleteRecBtn, modalCancelBtn])
            setModalVisible(true);
        },
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
        if (property === "deleteIng" && recLength) {
            console.log("skip")
        } else if (property === "deleteRec" && !recLength) {
            console.log("skip")
        } else {
            settingsBtns.push(button)
        }
    }

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        {settingsBtns.map( button => button )}
        <Modal 
            visible={modalVisible} 
            message={modalMessage} 
            pickers={modalPickers}
            inputs={modalInputs}
            buttons={modalButtons} 
            vertical={modalBtnsVertical}
            darkmode={false}
        />
        <ButtonBar buttons={[cancelBtn, saveBtn]} />
    </SafeAreaView>
}