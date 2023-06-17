import { useContext, useState, useEffect } from "react";
import { SafeAreaView, View, Text, StatusBar, Alert, Platform, Keyboard } from "react-native";
import * as Linking from "expo-linking";
import { getAuth, signOut } from 'firebase/auth';
import firebaseInit, { app } from "../storage/firebaseInit";
import ButtonBar from '../components/ButtonBar';
import SettingButton from "../components/SettingButton";
import { containers, textStyles } from '../constants/Styles';
import Modal from "../components/Modal";
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import { UserContext } from "../constants/UserContext";
import { SettingsContext } from "../constants/SettingsContext";
import { storeSettings, storeIng, deleteIng, storeRec, deleteRec, getIngAndRec } from "../storage/localAsync";


export default function SettingsScreen ({ route, navigation }) {
    const { recLength, ingLength } = route.params;
    const { settingsObj, setSettingsObj} = useContext(SettingsContext);
    const { user, setUser } = useContext(UserContext);
    const [darkMode, setDarkMode] = useState(settingsObj.darkMode || false);
    const [currency, setCurrency] = useState(settingsObj.currency || Strings.util.currencies[0]);
    const [language, setLanguage] = useState(settingsObj.language || Strings.util.languages[0]);
    const [prefLogin, setPrefLogin] = useState(settingsObj.login || Strings.util.logins[0]);
    const [decimalLength, setDecimalLength] = useState(settingsObj.decimalLength || 2)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtons, setModalButtons] = useState([]);
	const [modalPickers, setModalPickers] = useState([]);
    const [modalInputs, setModalInputs] = useState([]);
    const [modalBtnsVertical, setModalBtnsVertical] = useState(false);
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

    const closeModal = () => {
        setModalVisible(false);
        setModalMessage("");
        setModalButtons([]);
    }
    
    let cancelBtn = {
        title: Strings.English.buttons.cancel,
        color: darkMode ? Colors.darkTheme.buttons.cancel : Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.pop()
        },
        darkMode: darkMode
    }
    let saveBtn = {
        title: Strings.English.buttons.save,
        color: darkMode ? Colors.darkTheme.buttons.save : Colors.lightTheme.buttons.save,
        iconName: Icons.save,
        onPress: () => {
            let obj = {
                darkMode: darkMode, 
                currency: currency, 
                language: language, 
                login: prefLogin,
                decimalLength: decimalLength
            }
            setSettingsObj(obj);
            storeSettings(obj);
            navigation.push(Strings.util.routes.home)
        },
        darkMode: darkMode
    }

    let modalCancelBtn = {
        title: Strings.English.buttons.cancel,
        color: darkMode ? Colors.darkTheme.buttons.cancel : Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            closeModal();
        }
    }

    let modalDeleteIngBtn = {
        title: Strings.English.buttons.delete,
        color: darkMode ? Colors.darkTheme.buttons.delete : Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
            closeModal();
            if (prefLogin === Strings.util.logins[0]) {
                deleteIng();
            } else if (prefLogin === !Strings.util.logins[0]) {
                firebaseInit.dbMethods.deleteAllIngredients(user.uid);
            }
            navigation.pop();
        }
    }

    let modalDeleteRecBtn = {
        title: Strings.English.buttons.delete,
        color: darkMode ? Colors.darkTheme.buttons.delete : Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
            closeModal();
            if (prefLogin === Strings.util.logins[0]) {
                deleteRec();
            } else if (prefLogin === !Strings.util.logins[0]) {
                firebaseInit.dbMethods.deleteAllRecipes(user.uid);
            }
            navigation.pop();
        }
    }

    let modalOverwriteLocalBtn = {
        title: Strings.English.buttons.okay,
        color: darkMode ? Colors.darkTheme.buttons.save : Colors.lightTheme.buttons.save,
        iconName: Icons.okay,
        onPress: () => {
            setModalMessage(Strings.English.messages.overwriteInProgress);
            setModalButtons([]);
            let ingredients = {};
            let recipes = {};
            firebaseInit.dbMethods.getAllIngAndRec(user.uid,(value) => {
                if (value) {
                    ingredients = value.ingredients
                    recipes = value.recipes
                }
                Promise.all([storeIng(ingredients), storeRec(recipes)]).then(closeModal());
            })
        }
    }

    let modalOverwriteRemoteBtn = {
        title: Strings.English.buttons.okay,
        color: darkMode ? Colors.darkTheme.buttons.save : Colors.lightTheme.buttons.save,
        iconName: Icons.okay,
        onPress: async () => {
            setModalMessage(Strings.English.messages.overwriteInProgress);
            setModalButtons([]);
            let value = await getIngAndRec();
            firebaseInit.dbMethods.overwriteAllIngAndRec(user.uid, value);
            closeModal();
        }
    }

    let modalDeleteAllRemote = {
        title: Strings.English.buttons.delete,
        color: darkMode ? Colors.darkTheme.buttons.delete : Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
            setModalMessage(Strings.English.messages.deleting);
            setModalButtons([]);
            firebaseInit.dbMethods.deleteAllUserData(user.uid);
            closeModal();
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
        overwriteLocal: () => {
            setModalMessage(Strings.English.messages.overwriteLocal);
            setModalButtons([modalOverwriteLocalBtn, modalCancelBtn])
            setModalVisible(true);
        },
        overwriteRemote: () => {
            setModalMessage(Strings.English.messages.overwriteRemote);
            setModalButtons([modalOverwriteRemoteBtn, modalCancelBtn])
            setModalVisible(true);
        },
        deleteAllUserDataRemote: () => {
            setModalMessage(Strings.English.messages.deleteAllUserDataRemote);
            setModalButtons([modalDeleteAllRemote, modalCancelBtn])
            setModalVisible(true);
        },
        subscriptions: () => {
            // Alert.alert(Strings[language].headers.errorAlert, Strings.English.buttons.allSettings.subscriptions);
            navigation.push(Strings.util.routes.purchase)
        },
        feedback: async () => {
            let supported = await Linking.canOpenURL(Strings.util.mailto);
            if (supported) {
                await Linking.openURL(Strings.util.mailto)
            }
            else {
                Alert.alert(Strings[language].headers.errorAlert, Strings.util.mailto)
            }
        },
        site: async () => {
            let supported = await Linking.canOpenURL(Strings.util.website);
            if (supported) {
                await Linking.openURL(Strings.util.website)
            }
            else {
                Alert.alert(Strings[language].headers.errorAlert, Strings.util.website);
            }
        },
        privacy: async () => {
            let supported = await Linking.canOpenURL(Strings.util.privacy);
            if (supported) {
                await Linking.openURL(Strings.util.privacy)
            }
            else {
                Alert.alert(Strings[language].headers.errorAlert, Strings.util.privacy);
            }
        },
        eula: async () => {
            let supported = await Linking.canOpenURL(Strings.util.eula);
            if (supported) {
                await Linking.openURL(Strings.util.eula)
            }
            else {
                Alert.alert(Strings[language].headers.errorAlert, Strings.util.eula);
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
            darkMode={darkMode}
        />
        if (property === "deleteIng" && (recLength || !ingLength)) {
            // console.log("skip")
        } else if (property === "deleteRec" && !recLength) {
            // console.log("skip")
        } else if ((property === "overwriteLocal" || property === "overwriteRemote" || property === "deleteAllUserDataRemote" || property === "logout") && prefLogin === Strings.util.logins[0]) {
            // console.log("skip")
        } else if (property === "eula" && Platform.OS === 'android') {
            // console.log("skip")
        } else {
            settingsBtns.push(button)
        }
    }

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        <StatusBar 
            barStyle={darkMode ? 'light-content' : 'dark-content'}
        />
        {Platform.OS === 'android' && <View style={{height: StatusBar.currentHeight}} />}
        <Text style={[textStyles.headerText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{Strings.English.headers.settings}</Text>
        <View style={containers.settingsBtnList}>
            {settingsBtns.map( button => button )}
        </View>
        <Modal 
            visible={modalVisible} 
            message={modalMessage} 
            pickers={modalPickers}
            inputs={modalInputs}
            buttons={modalButtons} 
            vertical={modalBtnsVertical}
            darkMode={darkMode}
        />
        {!keyboardOut && <ButtonBar buttons={[cancelBtn, saveBtn]} />}
    </SafeAreaView>
}