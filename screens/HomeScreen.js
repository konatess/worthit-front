import { useState, useContext, useEffect, useCallback } from "react";
import { Text, SafeAreaView, FlatList, Platform, View, StatusBar, Keyboard } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ButtonBar from '../components/ButtonBar';
import { containers, textStyles } from '../constants/Styles';
import Icons from "../constants/Icons";
import IngButton from "../components/IngButton";
import Modal from "../components/Modal";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import * as WebBrowser from 'expo-web-browser';
import { UserContext } from "../constants/UserContext";
import { Entitlements } from "../constants/EntitlementsContext";
import { SettingsContext } from "../constants/SettingsContext";
import firebaseInit from "../storage/firebaseInit";
import ProdButton from "../components/ProdButton";
import DataLimits from "../constants/DataLimits";
import Calculate from "../constants/Calculate";
import { storeIng, getIng, getRec } from "../storage/localAsync";

WebBrowser.maybeCompleteAuthSession();


export default function HomeScreen ({ route, navigation }) {
	const { settingsObj } = useContext(SettingsContext)
    const { user } = useContext(UserContext);
    const { entitlements } = useContext(Entitlements);
    const [viewIng, setViewIng] = useState(false);
    const [allIngredients, setAllIngredients] = useState({});
    const [ingButtons, setIngButtons] = useState([]);
    const [products, setProducts] = useState({});
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
    const [ingInventory, setIngInventory] = useState(0);
    const [maxRec, setMaxRec] = useState(false);
    const [maxIng, setMaxIng] = useState(false);
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

    useEffect(() => {
        if (settingsObj.login === Strings.util.logins[0]) {
            getIng(setAllIngredients)
        } else {
            let unsubscribe = firebaseInit.dbMethods.listen.ing(user.uid, setAllIngredients)
            return unsubscribe
        }
    }, [])

    useEffect(() => {
        createIngButtons();
    }, [allIngredients])

    useEffect(() => {
        if (settingsObj.login === Strings.util.logins[0]) {
            getRec(setProducts);
        } else {
            let unsubscribe = firebaseInit.dbMethods.listen.rec(user.uid, setProducts)
            return unsubscribe
        }
    }, [])
    
    useEffect(() => {
        createProdButtons();
    }, [products])

    useEffect(() => {
        const ingLimit = !entitlements.storage1 ? DataLimits.ingredients.level0 : DataLimits.ingredients.level1;
        if (ingButtons.length < ingLimit) {
            setMaxIng(false);
        } else {
            setMaxIng(true);
        }
    }, [ingButtons])

    useEffect(() => {
        const recLimit = !entitlements.storage1 ? DataLimits.recipes.level0 : DataLimits.recipes.level1;
        if (prodButtons.length < recLimit) {
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
        if (ingId && !(allIngredients[ingId]?.recipes)) {
            modalBtns.unshift(modalDeleteIngBtn)
        }
        setModalButtons(modalBtns);
    }, [ingId, ingName, ingCost, ingUnit, ingInventory])

    useFocusEffect(
        useCallback( () => {
            if (settingsObj.login === Strings.util.logins[0]) {
                getRec(setProducts);
                getIng(setAllIngredients);
            }
        }, [] )
    )

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
                    name: allIngredients[id]?.name,
                    cost: allIngredients[id]?.cost,
                    unit: allIngredients[id]?.unit,
                    inventory: allIngredients[id]?.inventory,
                    numRecipes: (allIngredients[id].hasOwnProperty('recipes') ? Object.keys(allIngredients[id].recipes).length : 0)
                }
            buttons.push(button)
        }
        setIngButtons(buttons)
    }

    const createProdButtons = () => {
        let buttons = [];
        for (const id in products) {
            let wage = Calculate.wagePerItem(products[id]?.wage, products[id]?.time?.hour, products[id]?.time?.minute, products[id]?.time?.amount);
            let ing = Calculate.ingredientCost(products[id]?.ingredients, allIngredients)
            let totalCost = Calculate.totalCost(wage, ing);
            let button = {
                    id: id,
                    title: products[id]?.title,
                    profitAmount: Calculate.limitDec(products[id]?.profitAmount, settingsObj.decimalLength),
                    price: Calculate.limitDec(Calculate.priceByAmount(totalCost, products[id]?.profitAmount), settingsObj.decimalLength),
                    inventory: products[id]?.inventory
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
            ingredients: {},
            inventory: 0
        }
        navigation.push(Strings.util.routes.recipe, {
            prodDbId: id,
            prodObj: product, 
            knownIng: allIngredients,
            products: products,
            maxRec: maxRec
        })
    };

    const callIngModal = (ingObj) => {
        if (ingObj) {
            setIngId(ingObj.id);
            setIngName(ingObj.name);
            setIngUnit(ingObj.unit);
            setIngCost(ingObj.cost);
            setIngInventory(ingObj.inventory);
            setModalBtnsVertical(true);
        } else {
            setIngId("");
            setIngName("");
            setIngUnit("");
            setIngCost(0);
            setIngInventory(0);
        }
        setModalInputs([
            {label: Strings.English.label.ingName, default: ingObj.name || "", maxChar: DataLimits.inputs.ingNameMax, onChange: (text) => {setIngName(text)}},
            {label: Strings.English.label.ingUnit, default: ingObj.unit || "", maxChar: DataLimits.inputs.ingUnitMax, onChange: (text) => {setIngUnit(text)}},
            {label: Strings.English.label.ingCost, default: ingObj ? ingObj.cost.toString() : "", maxChar: DataLimits.inputs.ingCostMax, onChange: text => {
                setIngCost(Calculate.getNum(text));
            }, keyboardType: "decimal-pad"},
            {label: Strings.English.label.inventory, default: ingObj ? ingObj.inventory.toString() : "0", maxChar: DataLimits.inputs.ingInventoryMax, onChange: text => {
                setIngInventory(Calculate.getNum(text));
            }, keyboardType: "decimal-pad"}
        ])
        setModalButtons([modalCancelBtn])
        setModalVisible(true);
    }

    const saveIngredient = async () => {
        let newName = ingName.trim();
        let newUnit = ingUnit.trim();
        let newCost = ingCost;
        let newInventory = ingInventory;
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
                inventory: newInventory
            }
            if (ingId && allIngredients[ingId]?.recipes) {
                ing.recipes = allIngredients[ingId].recipes
            }
            if (settingsObj.login === Strings.util.logins[0]) {
                let allIngObj = allIngredients;
                if (ingId) {
                    allIngObj[ingId] = ing;
                } else {
                    let id = firebaseInit.dbMethods.createId();
                    allIngObj[id] = ing;
                }
                storeIng(allIngObj).then(getIng(setAllIngredients));
            } else if (settingsObj.login !== Strings.util.logins[0]) {
                if (ingId) {
                    firebaseInit.dbMethods.updateIngredient(user.uid, ingId, ing);
                } else {
                    firebaseInit.dbMethods.newIngredient(user.uid, ing);
                }
            }
            closeModal();
        }
    }

    const deleteIngredient = (id) => {
        if (settingsObj.login === Strings.util.logins[0]) {
            let allIngObj = allIngredients;
            delete allIngObj[id];
            storeIng(allIngObj).then(getIng(setAllIngredients));
        } else if (settingsObj.login !== Strings.util.logins[0]) {
            firebaseInit.dbMethods.deleteIngredient(user.uid, id);
        }
        setIngId("");
    }

    let modalCancelBtn = {
        title: Strings.English.buttons.cancel,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.cancel : Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            closeModal();
            setIngId("");
        },
        darkMode: settingsObj.darkMode
    }

    let modalDeleteIngBtn = {
        title: Strings.English.buttons.delete,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.delete : Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
            deleteIngredient(ingId)
            closeModal();
        },
        darkMode: settingsObj.darkMode
    }

    let modalSaveIngBtn = {
        title: Strings.English.buttons.save,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.create : Colors.lightTheme.buttons.create,
        iconName: Icons.create,
        onPress: () => {
            saveIngredient();
        },
        darkMode: settingsObj.darkMode
    }

    let modalUpgradeSubBtn = {
        title: Strings.English.buttons.upgrade,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.upgrade : Colors.lightTheme.buttons.upgrade,
        iconName: Icons.upgrade,
        onPress: () => {
            navigation.push(Strings.util.routes.purchase);
            closeModal();
        },
        darkMode: settingsObj.darkMode
    }

    let settingsbtn = {
        title: Strings.English.buttons.settings,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.settings : Colors.lightTheme.buttons.settings,
        iconName: Icons.settings,
        onPress: () => {
            navigation.push(Strings.util.routes.settings, {recLength: prodButtons.length, ingLength: ingButtons.length})
        },
        darkMode: settingsObj.darkMode
    }
    let createbtn = {
        title: Strings.English.buttons.create,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.create : Colors.lightTheme.buttons.create,
        iconName: Icons.create,
        onPress: viewIng ? maxIng ? () => {
            setModalMessage(Strings.English.messages.dataLimit.ing);
            setModalButtons([modalCancelBtn, modalUpgradeSubBtn])
            setModalVisible(true)
        } : () => callIngModal(false) : maxRec ? () => {
            setModalMessage(Strings.English.messages.dataLimit.rec);
            setModalButtons([modalCancelBtn, modalUpgradeSubBtn])
            setModalVisible(true)
        } : () => navToRecipe(""),
        darkMode: settingsObj.darkMode
    }
    let ingBtn = {
        title: viewIng ? Strings.English.buttons.products : Strings.English.buttons.ingredients,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.filter : Colors.lightTheme.buttons.filter,
        iconName: viewIng ? Icons.product : Icons.ingredient,
        onPress: () => {
            setViewIng(!viewIng)
        },
        darkMode: settingsObj.darkMode
    }
    return (<SafeAreaView style={[containers.safeArea, {backgroundColor: settingsObj.darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        <StatusBar 
            barStyle={settingsObj.darkMode ? 'light-content' : 'dark-content'}
        />
        {Platform.OS === 'android' && <View style={{height: StatusBar.currentHeight}} />}
        <Text style={[textStyles.headerText, {color: settingsObj.darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{viewIng ? Strings.English.headers.ingredients : Strings.English.headers.recipes}</Text>
        {ingButtons.length > 0 && viewIng && <FlatList 
            style={[ containers.projArea ]}
            data={ingButtons}
            renderItem={({ item }) => <IngButton 
                key={"ing" + item.id} 
                name={item.name}
                cost={item.cost}
                unit={item.unit}
                inventory={item.inventory}
                numRecipes={item.numRecipes}
                onPress={() => {
                    callIngModal({
                        id: item.id,
                        name: item.name,
                        cost: item.cost,
                        unit: item.unit,
                        inventory: item.inventory
                    })
                }}
                darkMode={settingsObj.darkMode}
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
                inventory={item.inventory}
                onPress={() => {
                    navToRecipe(item.id);
                }}
                darkMode={settingsObj.darkMode}
            />}
        />}
        {entitlements.storage1 && prodButtons.length === 0 && <View style={[containers.screenMsgArea]} >
            <Text style={[textStyles.productTitleText]} >{Strings.English.messages.subNoProd}</Text>
        </View>}
        <Modal 
            visible={modalVisible} 
            message={modalMessage} 
            pickers={modalPickers}
            inputs={modalInputs}
            buttons={modalButtons} 
            vertical={modalBtnsVertical}
            darkMode={settingsObj.darkMode}
        />
        {!keyboardOut && <ButtonBar buttons={[settingsbtn, ingBtn, createbtn]} />}
    </SafeAreaView>)
}