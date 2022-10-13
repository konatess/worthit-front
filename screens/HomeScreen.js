import { useState, useContext, useEffect } from "react";
import { Text, SafeAreaView, View } from "react-native";

import ButtonBar from '../components/ButtonBar';
import { containers } from '../constants/Styles';
import Icons from "../constants/Icons";
import IngButton from "../components/IngButton";
import Modal from "../components/Modal";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import * as WebBrowser from 'expo-web-browser';
import { app } from "../storage/firebaseInit";
import { UserContext } from "../constants/UserContext";
import { getDatabase, ref, set, push, onValue, get, child } from 'firebase/database';

WebBrowser.maybeCompleteAuthSession();

const database = getDatabase(app, "https://worth-888-default-rtdb.firebaseio.com/");


export default function HomeScreen ({ route, navigation }) {
	const { settings } = route.params;
    const { user } = useContext(UserContext)
    const [viewIng, setViewIng] = useState(false);
    const [allIngredients, setAllIngredients] = useState({});
    const [ingButtons, setIngButtons] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtons, setModalButtons] = useState([]);
	const [modalPickers, setModalPickers] = useState([]);
    const [modalInputs, setModalInputs] = useState([]);
    const [ingName, setIngName] = useState("");
    const [ingUnit, setIngUnit] = useState("");
    const [ingCost, setIngCost] = useState(0);


    const ingredients = ref(database, `users/${user.uid}/ingredients`)
    // const userRef = ref(database, `users/${user.uid}`)

    useEffect(() => {
        let unsubscribe = onValue(ingredients, (snapshot) => {
            if (snapshot.exists()) {
                setAllIngredients(snapshot.val())
                let buttons = [];
                for (const id in allIngredients) {
                    let button = <IngButton 
                    key={"ing" + id}
                    name={allIngredients[id].name}
                    cost={allIngredients[id].cost}
                    unit={allIngredients[id].unit}
                    onPress={() => {
                        setViewIng(false);
                    }}
                />
                    buttons.push(button)
                }
                setIngButtons(buttons)
            }
        })
        return unsubscribe
    }, [])

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
                ingredients: {}
            }, 
            allIngredients: allIngredients
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
            console.log('ingName = ' + ingName)
            let ing = {
                name: ingName,
                unit: ingUnit,
                cost: ingCost,
            }
            push(ingredients, ing).catch(error => console.log(error.message));
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
    return (<SafeAreaView style={[containers.safeArea, {backgroundColor: Colors.lightTheme.background}]}> 
        <Text>{"viewIng: " + viewIng}</Text>
        <Text>{JSON.stringify(allIngredients)}</Text>
        {/* {allIngredients.length > 0 && <Text>{JSON.stringify(allIngredients)}</Text>} */}
        {ingButtons.length > 0 && viewIng && <View style={containers.projArea}>
            {ingButtons.map(button => button)}
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
    </SafeAreaView>)
}