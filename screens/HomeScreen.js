import { useState, useEffect } from "react";
import { Text, SafeAreaView, View, Pressable } from "react-native";

import ButtonBar from '../components/ButtonBar';
import { containers } from '../constants/Styles';
import Icons from "../constants/Icons";
import IngButton from "../components/IngButton";
import Modal from "../components/Modal";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import LoginButton from "../constants/Storage";
// import { firebaseAuth } from "../constants/firebase";


export default function HomeScreen ({ route, navigation }) {
	const { settings } = route.params;
    const [viewIng, setViewIng] = useState(false);
    const [allIngredients, setAllIngredients] = useState([{
            name: "purple yarn",
            unit: "skein",
            cost: "3.95"
        },
        {
            name: "green yarn",
            unit: "skein",
            cost: "3.65"
        }]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtons, setModalButtons] = useState([]);
	const [modalPickers, setModalPickers] = useState([]);
    const [modalInputs, setModalInputs] = useState([]);
    const [ingName, setIngName] = useState("");
    const [ingUnit, setIngUnit] = useState("");
    const [ingCost, setIngCost] = useState(0);
    // const [signedIn, setSignedIn] = useState(false);
    // const [facebookError, setFacebookError] = useState('');

    // const signUpEmail = () => {
    //     firebaseAuth
    //     .createUserWithEmailAndPassword('konatess@gmail.com', 'password')
    //     .then(userCredentials => {
    //         const user = userCredentials.user;
    //         console.log(user.email)
    //     })
    //     .catch(error => alert(error.message))
    // } 

    const navToRecipe = () => {
        navigation.navigate(Strings.util.routes.recipe, {
            prodObj: {
                name: "",
                note: "",
                hour: 0,
                minute: 0,
                amount: 0,
                wage: 0.00,
                profitPercent: 0.0,
                profitAmount: 0,
                ingredients: []
            }, 
            allIngredients: [
                {
                    name: "purple yarn",
                    unit: "skein",
                    cost: "3.95"
                },
                {
                    name: "green yarn",
                    unit: "skein",
                    cost: "3.65"
                }
            ]
        })
    };

    const callIngModal = (ingObj) => {
        if (ingObj) {
            setIngName(ingObj.name);
            setIngUnit(ingObj.unit);
            setIngCost(ingObj.cost);
        }
        setModalButtons([modalCancelBtn, modalSaveIngBtn]);
        setModalInputs([
            {label: Strings.English.label.ingName, default: ingObj.name || "", onChange: setIngName},
            {label: Strings.English.label.ingUnit, default: ingObj.unit || "", onChange: setIngUnit},
            {label: Strings.English.label.ingCost, default: ingObj.cost || 0, onChange: setIngCost, keyboardType: "decimal-pad"}
        ])
        setModalVisible(true);
    }

    let modalCancelBtn = {
        title: Strings.English.buttons.cancel,
        color: Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            setModalVisible(false);
            setModalMessage("");
            setModalPickers([]);
            setModalButtons([]);
        }
    }

    let modalSaveIngBtn = {
        title: Strings.English.buttons.save,
        color: Colors.lightTheme.buttons.create,
        iconName: Icons.create,
        onPress: async () => {
            let ing = {
                name: ingName,
                unit: ingUnit,
                cost: ingCost,
            }
            // await Storage.createIng(ing, settings.language)
            setModalVisible(false);
            setModalMessage("");
            setModalPickers([]);
            setModalButtons([]);
        }
    }

    let settingsbtn = {
        title: Strings.English.buttons.settings,
        color: Colors.lightTheme.buttons.settings,
        iconName: Icons.settings,
        onPress: () => {
            navigation.navigate(Strings.util.routes.settings, {settings: settings})
        }
    }
    let createbtn = {
        title: Strings.English.buttons.create,
        color: Colors.lightTheme.buttons.create,
        iconName: Icons.create,
        onPress: viewIng ? callIngModal : navToRecipe
    }
    let ingBtn = {
        title: viewIng ? "Products" : "Ingredients",
        color: Colors.lightTheme.buttons.filter,
        iconName: viewIng ? Icons.product : Icons.ingredient,
        onPress: () => {setViewIng(!viewIng)}
    }
    return <SafeAreaView style={[containers.safeArea, {backgroundColor: Colors.lightTheme.background}]}> 
        {/* <Pressable onPress={signUpEmail}>
            <Text>Login Email</Text>
        </Pressable> */}
        <LoginButton />
        <Text>{}</Text>
        <Text>{"viewIng: " + viewIng}</Text>
        {allIngredients.length > 0 && viewIng && <View style={containers.projArea}>
            {allIngredients.map((ingredient, index) => {
                return <IngButton 
                    keyid={"ing" + index}
                    name={ingredient.name}
                    cost={ingredient.cost}
                    unit={ingredient.unit}
                    onPress={() => {
                        setViewIng(false);
                    }}
                />
            })}
        </View>}
        <Modal 
            visible={modalVisible} 
            message={modalMessage} 
            pickers={modalPickers}
            inputs={modalInputs}
            buttons={modalButtons} 
            vertical={false}
            darkmode={false}
        />
        <ButtonBar buttons={[settingsbtn, ingBtn, createbtn]} />
    </SafeAreaView>
}