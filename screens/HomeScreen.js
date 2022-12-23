import { useState, useContext, useEffect } from "react";
import { Text, SafeAreaView, FlatList, ke } from "react-native";

import ButtonBar from '../components/ButtonBar';
import { containers, textStyles } from '../constants/Styles';
import Icons from "../constants/Icons";
import IngButton from "../components/IngButton";
import Modal from "../components/Modal";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import * as WebBrowser from 'expo-web-browser';
import { UserContext } from "../constants/UserContext";
import firebaseInit, { app } from "../storage/firebaseInit";
import { getDatabase, ref, onValue } from 'firebase/database';
import ProdButton from "../components/ProdButton";
import DataLimits from "../constants/DataLimits";
import Calculate from "../constants/Calculate";

WebBrowser.maybeCompleteAuthSession();

const database = getDatabase(app, "https://worth-888-default-rtdb.firebaseio.com/");


export default function HomeScreen ({ route, navigation }) {
	const { settings } = route.params;
    const { user } = useContext(UserContext);
    const [viewIng, setViewIng] = useState(false);
    const [allIngredients, setAllIngredients] = useState({});
    const [ingButtons, setIngButtons] = useState([]);
    const [products, setProducts] = useState([]);
    const [prodButtons, setProdButtons] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtons, setModalButtons] = useState([]);
	const [modalPickers, setModalPickers] = useState([]);
    const [modalInputs, setModalInputs] = useState([]);
    const [modalBtnsVertical, setModalBtnsVertical] = useState(false);
    const [ingId, setIngId] = useState("");
    const [ingName, setIngName] = useState("");
    const [ingUnit, setIngUnit] = useState("");
    const [ingCost, setIngCost] = useState(0);
    const [maxRec, setMaxRec] = useState(false);
    const [maxIng, setMaxIng] = useState(false);
    // const []

    useEffect(() => {
        let unsubscribe = onValue(ref(database, `users/${user.uid}/ingredients`), (snapshot) => {
            if (snapshot.exists()) {
                setAllIngredients(snapshot.val());
            }
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        createIngButtons();
    }, [allIngredients])

    useEffect(() => {
        let unsubscribe = onValue(ref(database, `users/${user.uid}/recipes`), (snapshot) => {
            if (snapshot.exists()) {
                setProducts(snapshot.val());
            }
        })
        return unsubscribe
    }, [])
    
    useEffect(() => {
        createProdButtons();
    }, [products])

    useEffect(() => {
        if (ingButtons.length < DataLimits.ingredients.level1) {
            setMaxIng(false);
        } else {
            setMaxIng(true);
        }
    }, [ingButtons])

    useEffect(() => {
        if (prodButtons.length < DataLimits.recipes.level1) {
            setMaxRec(false);
        } else {
            setMaxRec(true);
        }
    }, [prodButtons])

    useEffect(() => {
        let modalBtns = [modalCancelBtn];
        if (ingName && ingCost && ingUnit) {
            modalBtns.push(modalSaveIngBtn)
        }
        if (ingId) {
            modalBtns.unshift(modalDeleteIngBtn)
        }
        setModalButtons(modalBtns);
    }, [ingId, ingName, ingCost, ingUnit])

    const closeModal = () => {
        setModalVisible(false);
        setModalMessage("");
        setModalPickers([]);
        setModalInputs([]);
        setModalButtons([]);
        setModalBtnsVertical(false);
    }

    const createIngButtons = () => {
        let buttons = [];
        for (const id in allIngredients) {
            let button = {
                    id: id,
                    name: allIngredients[id].name,
                    cost: allIngredients[id].cost,
                    unit: allIngredients[id].unit,
                }
            buttons.push(button)
        }
        setIngButtons(buttons)
    }

    const createProdButtons = () => {
        let buttons = [];
        for (const id in products) {
            let wage = Calculate.wagePerItem(products[id].wage, products[id].time.hour, products[id].time.minute, products[id].time.amount);
            let ing = Calculate.ingredientCost(products[id].ingredients, allIngredients)
            let totalCost = Calculate.totalCost(wage, ing);
            let button = {
                    id: id,
                    title: products[id].title,
                    profitAmount: products[id].profitAmount,
                    price: Calculate.priceByAmount(totalCost, products[id].profitAmount),
                }
            buttons.push(button)
        }
        setProdButtons(buttons)
    }

    const navToRecipe = (id) => {
        let product = id.length ? products[id] :  {
            name: "",
            note: "",
            time: {
                hour: 0,
                minute: 0,
                amount: 0
            },
            wage: 0.00,
            profitPercent: 0.0,
            profitAmount: 0,
            ingredients: {}
        }
        navigation.navigate(Strings.util.routes.recipe, {
            prodDbId: id,
            prodObj: product, 
            knownIng: allIngredients
        })
    };

    const callIngModal = (ingObj) => {
        if (ingObj) {
            setIngId(ingObj.id);
            setIngName(ingObj.name);
            setIngUnit(ingObj.unit);
            setIngCost(ingObj.cost);
            setModalBtnsVertical(true);
        } else {
            setIngId("");
            setIngName("");
            setIngUnit("");
            setIngCost(0);
        }
        setModalInputs([
            {label: Strings.English.label.ingName, default: ingObj.name || "", maxChar: DataLimits.inputs.ingNameMax, onChange: (text) => {setIngName(text)}},
            {label: Strings.English.label.ingUnit, default: ingObj.unit || "", maxChar: DataLimits.inputs.ingUnitMax, onChange: (text) => {setIngUnit(text)}},
            {label: Strings.English.label.ingCost, default: ingObj ? ingObj.cost.toString() : "", maxChar: DataLimits.inputs.ingCostMax, onChange: text => {
                let trimmed = text.trim();
                let num = parseFloat(trimmed);
                setIngCost(isNaN(num) ? 0 : num);
            }, keyboardType: "decimal-pad"}
        ])
        setModalButtons([modalCancelBtn])
        setModalVisible(true);
    }

    const saveIngredient = async () => {
        let newName = ingName.trim();
        let newUnit = ingUnit.trim();
        let newCost = ingCost;
        if(newName.length === 0) {
            setModalMessage(Strings.English.messages.ingNameTooShort)
        } else if (Strings.util.regex.titles.test(newName)) {
            setModalMessage(Strings.English.messages.ingNameBadChar)
        } else if (newUnit.length === 0) {
            setModalMessage(Strings.English.messages.ingUnitTooShort)
        } else if (Strings.util.regex.units.test(newUnit)) {
            setModalMessage(Strings.English.messages.ingUnitBadChar)
        } else if (ingCost === 0) {
            setModalMessage(Strings.English.messages.ingCostZero)
        }
        else {
            let ing = {
                name: newName,
                unit: newUnit,
                cost: newCost,
            }
            if (ingId) {
                firebaseInit.dbMethods.updateIngredient(user.uid, ingId, ing);
            } else {
                firebaseInit.dbMethods.newIngredient(user.uid, ing);
            }
            closeModal();
        }
    }

    const deleteIngredient = (id) => {
        firebaseInit.dbMethods.deleteIngredient(user.uid, id);
        setIngId("");
        setViewIng(false);
    }

    let modalCancelBtn = {
        title: Strings.English.buttons.cancel,
        color: Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            closeModal();
            setIngId("");
        }
    }

    let modalDeleteIngBtn = {
        title: Strings.English.buttons.delete,
        color: Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
            deleteIngredient(ingId)
            closeModal();
        }
    }

    let modalSaveIngBtn = {
        title: Strings.English.buttons.save,
        color: Colors.lightTheme.buttons.create,
        iconName: Icons.create,
        onPress: () => {
            saveIngredient();
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
        onPress: viewIng ? () => callIngModal(false) : () => navToRecipe(""),
        disabled: viewIng ? maxIng : maxRec
    }
    let ingBtn = {
        title: viewIng ? Strings.English.buttons.products : Strings.English.buttons.ingredients,
        color: Colors.lightTheme.buttons.filter,
        iconName: viewIng ? Icons.product : Icons.ingredient,
        onPress: () => {
            setViewIng(!viewIng)
        }
    }
    return (<SafeAreaView style={[containers.safeArea, {backgroundColor: Colors.lightTheme.background}]}> 
        <Text style={[textStyles.headerText]}>{viewIng ? Strings.English.headers.ingredients : Strings.English.headers.recipes}</Text>
        {ingButtons.length > 0 && viewIng && <FlatList 
            style={[ containers.projArea ]}
            data={ingButtons}
            renderItem={({ item }) => <IngButton 
                key={"ing" + item.id} 
                name={item.name}
                cost={item.cost}
                unit={item.unit}
                onPress={() => {
                    callIngModal({
                        id: item.id,
                        name: item.name,
                        cost: item.cost,
                        unit: item.unit,
                    })
                }}
            />}
        />}
        {prodButtons.length > 0 && !viewIng && <FlatList 
            style={[ containers.projArea ]}
            data={prodButtons}
            renderItem={({ item }) => <ProdButton 
                key={"prod" + item.id} 
                title={item.title}
                price={item.price}
                profitAmount={item.profitAmount}
                onPress={() => {
                    navToRecipe(item.id);
                }}
            />}
        />}
        <Modal 
            visible={modalVisible} 
            message={modalMessage} 
            pickers={modalPickers}
            inputs={modalInputs}
            buttons={modalButtons} 
            vertical={modalBtnsVertical}
            darkmode={false}
        />
        <ButtonBar buttons={[settingsbtn, ingBtn, createbtn]} />
    </SafeAreaView>)
}