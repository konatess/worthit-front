import { useContext, useEffect, useState } from "react";
import { SafeAreaView, View, StatusBar } from "react-native";
import * as Linking from "expo-linking";
import { getAuth, signOut } from 'firebase/auth';
import firebaseInit, { app } from "../storage/firebaseInit";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import ButtonBar from '../components/ButtonBar';
import SettingButton from "../components/SettingButton";
import { containers } from '../constants/Styles';
import Modal from "../components/Modal";
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import Notify from "../components/Notify";
import { UserContext } from "../constants/UserContext";
import { storeSettings, storeIng, deleteIng, storeRec, deleteRec, getIngAndRec } from "../storage/localAsync";


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

    useEffect(() => {
        const getsubs = async () => {
            Purchases.setLogLevel(LOG_LEVEL.DEBUG);
            Purchases.configure({
                // apiKey: "appl_NIMzKbuELZwYrRadlznGbomLWLN",
                apiKey: "goog_vCtRNkrJEMHsuLzlXyAtVaRsWjq",
            })
            // const subscriptions = Purchases.getProducts(["wi_10x_storage", "wi_10x_storage_annual"]);
            const subscriptions = Purchases.getProducts(["wi_fb_10x:wi-fb-10x-monthly"]);
            console.log(subscriptions);
        }
        
        getsubs();
    }, [])

    const closeModal = () => {
        setModalVisible(false);
        setModalMessage("");
        setModalButtons([]);
    }
    
    let cancelBtn = {
        title: "Cancel",
        color: darkMode ? Colors.darkTheme.buttons.cancel : Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.pop()
        },
        darkMode: darkMode
    }
    let saveBtn = {
        title: "Save",
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
            storeSettings(obj);
            navigation.push(Strings.util.routes.home, {settings: obj})
        },
        darkMode: darkMode
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
                firebaseInit.dbMethods.deleteAllIngredients(user.uid, );
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
                firebaseInit.dbMethods.deleteAllRecipes(user.uid);
            }
            navigation.pop();
        }
    }

    let modalOverwriteLocalBtn = {
        title: Strings.English.buttons.okay,
        color: Colors.lightTheme.buttons.save,
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
        color: Colors.lightTheme.buttons.save,
        iconName: Icons.okay,
        onPress: async () => {
            setModalMessage(Strings.English.messages.overwriteInProgress);
            setModalButtons([]);
            let value = await getIngAndRec();
            firebaseInit.dbMethods.overwriteAllIngAndRec(user.uid, value);
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
        subscriptions: () => {
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
            darkMode={darkMode}
        />
        if (property === "deleteIng" && recLength) {
            // console.log("skip")
        } else if (property === "deleteRec" && !recLength) {
            // console.log("skip")
        } else if ((property === "overwriteLocal" || property === "overwriteRemote" || property === "logout") && prefLogin === Strings.util.logins[0]) {
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
        <View style={containers.topPadding}></View>
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
        <ButtonBar buttons={[cancelBtn, saveBtn]} />
    </SafeAreaView>
}