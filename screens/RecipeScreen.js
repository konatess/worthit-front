import { useState, useEffect, useContext } from "react";
import { Text, SafeAreaView, View, TextInput, Keyboard, Pressable, KeyboardAvoidingView, ScrollView } from "react-native";
import uuid from "react-native-uuid";

import ButtonBar from '../components/ButtonBar';
import { containers, textStyles, inputStyles, rows, buttonStyles } from '../constants/Styles';
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import Modal from "../components/Modal";
import { UserContext } from "../constants/UserContext";
import firebaseInit, { app } from "../storage/firebaseInit";
import { getDatabase, ref, onValue } from 'firebase/database';
import { storeIng, getIng, storeRec, getRec } from "../storage/localAsync";
import IngAmount from "../components/IngAmount";
import DataLimits from "../constants/DataLimits";
import Calculate from "../constants/Calculate";

const database = getDatabase(app, "https://worth-888-default-rtdb.firebaseio.com/");

export default function RecipeScreen ({navigation, route}) {
    const { knownIng, prodObj, prodDbId, settings, products } = route.params;
    const { user } = useContext(UserContext);
    const [prefLogin, setPrefLogin] = useState(settings.login || Strings.util.logins[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtons, setModalButtons] = useState([]);
	const [modalPickers, setModalPickers] = useState([]);
    const [modalInputs, setModalInputs] = useState([]);
    const [modalBtnsVertical, setModalBtnsVertical] = useState(false);
    const [canSave, setCanSave] = useState(false)
    const [allIngredients, setAllIngredients] = useState(knownIng);
    const [prodId, setProdId] = useState(prodDbId ? prodDbId : "");
    const [name, setName] = useState(prodObj?.title ? prodObj.title : "");
    const [note, setNote] = useState(prodObj?.note ? prodObj.note : "");
    const [hour, setHour] = useState(prodObj?.time ? prodObj.time.hour : 0);
    const [minute, setMinute] = useState(prodObj?.time ? prodObj.time.minute : 0);
    const [amountPerTime, setAmountPerTime] = useState(prodObj ? prodObj.time.amount : 0)
    const [wage, setWage] = useState(prodObj?.wage ? prodObj.wage : 15.00);
    const [profitPercent, setProfitPercent] = useState(prodObj?.profitPercent ? prodObj.profitPercent : 0);
    const [profitAmount, setProfitAmount] = useState(prodObj?.profitAmount ? prodObj.profitAmount : 0);
    const [ingredients, setIngredients] = useState(prodObj?.ingredients ? prodObj.ingredients : {});
    const [ingTextList, setIngTextList] = useState([]);
    const [ingId, setIngId] = useState("");
    const [ingName, setIngName] = useState("");
    const [ingUnit, setIngUnit] = useState("");
    const [ingCost, setIngCost] = useState(0);
    const [ingPerItem, setIngPerItem] = useState(0);
    const [maxIng, setMaxIng] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const [keyboardOut, setKeyboardOut] = useState(false);
    const [ingInventory, setIngInventory] = useState(0);
    const [prodInventory, setProdInventory] = useState(prodObj?.inventory ? prodObj.inventory : 0);

    Platform.OS === 'android' &&  useEffect(() => {
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
    }, []);

    useEffect(() => {
        let modalBtns = [modalCancelBtn];
        if (ingName && ingCost && ingUnit) {
            modalBtns.push(modalSaveIngBtn)
            setModalBtnsVertical(false)
        }
        setModalButtons(modalBtns);
    }, [ingName, ingCost, ingUnit])

    useEffect(() => {
        let modalBtns = [modalCancelBtn];
        if (ingId.length) {
            modalBtns.unshift(removeIngredientBtn)
        }
        if (ingPerItem > 0) {
            modalBtns.push(modalSaveAmountBtn)
            setModalBtnsVertical(true)
        }
        setModalButtons(modalBtns);
    }, [ingPerItem])

    useEffect(() => {
        let list = [];
        for (const id in ingredients) {
            if (id) {
                list.push(<IngAmount 
                    key={id}
                    id={id}
                    amount={ingredients[id]}
                    name={allIngredients[id].name}
                    onPress={() => {
                        setIngId(id)
                        setIngPerItem(ingredients[id]);
                        setModalInputs([{
                            label: Strings.English.label.ingPerItem, 
                            default: ingredients[id] ? ingredients[id].toString() : "", 
                            onChange: text => {
                                setIngPerItem(Calculate.getNum(text));
                            }
                        }]);
                        setModalMessage(Strings.English.messages.ingPerItem.replace(/\*unit\*/g, allIngredients[id].unit));
                        setModalButtons([modalCancelBtn])
                        setModalVisible(true);
                    }}
                />)
            }
        }
        setIngTextList(list);
        if (list.length) {
            setTotalCost(calculateTotalCost())
        }
    }, [ingredients])

    useEffect(() => {
        let unsubscribe = onValue(ref(database, `users/${user.uid}/ingredients`), (snapshot) => {
            if (snapshot.exists()) {
                setAllIngredients(snapshot.val())
            }
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        if (Object.keys(allIngredients).length < DataLimits.ingredients.level1) {
            setMaxIng(false);
        } else {
            setMaxIng(true);
        }
    }, [allIngredients])

    useEffect(() => {
        if (name && (hour || minute) && amountPerTime && wage && profitAmount) {
            setCanSave(true);
        } else {
            setCanSave(false)
        }
    }, [name, hour, minute, amountPerTime, wage, profitAmount])

    useEffect(() => {
        if ((hour || minute) && amountPerTime && wage) {
            setTotalCost(calculateTotalCost())
        }
    }, [hour, minute, amountPerTime, wage])

    useEffect(() => {
        profitPercent && totalCost? setProfitAmount(Calculate.shortenNum(profitPercent/100*totalCost)) : setProfitAmount(0)
    }, [totalCost])

    const closeModal = () => {
        setModalVisible(false);
        setModalMessage("");
        setModalPickers([]);
        setModalInputs([]);
        setModalButtons([]);
        setModalBtnsVertical(true)
    }

    const createIngPickers = () => {
        let ingList = [];
        for (const id in allIngredients) {
            let ing = {
                id: id,
                amount: 0,
                name: allIngredients[id].name,
                onPress: () => {
                    closeModal();
                    return (id in ingredients) ? null : setIngredients({
                        ...ingredients,
                        [id]: 0
                    })
                }
            }
            ingList.push(ing)
        }
        return ingList
    }

    const saveIngredient = async () => {
        let newName = ingName.trim();
        let newUnit = ingUnit.trim();
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
                cost: ingCost,
                inventory: ingInventory
            }
            if (prefLogin === Strings.util.logins[0]) {
                let allIngObj = allIngredients;
                let id = uuid.v4();
                allIngObj[id] = ing;
                storeIng(allIngObj);
            } else if (prefLogin !== Strings.util.logins[0]) {
                firebaseInit.dbMethods.newIngredient(user.uid, ing)
            }
            closeModal();
        }
    }

    const saveAmount = () => {
        setIngredients({
            ...ingredients,
            [ingId]: ingPerItem
        })
        setIngPerItem(0);
        setIngId("");
    }

    const saveRecipe = async () => {
        let title = name.trim()
        if (!title.length) {
            setModalMessage(Strings.English.messages.prodNameShort)
            setModalButtons([modalOkayBtn])
            setModalVisible(true)
            return
        } else if (Strings.util.regex.titles.test(title)) {
            setModalMessage(Strings.English.messages.prodNameBadChar)
            setModalButtons([modalOkayBtn])
            setModalVisible(true)
            return
        } else if (Strings.util.regex.notes.test(note)) {
            setModalMessage(Strings.English.messages.prodNoteBadChar)
            setModalButtons([modalOkayBtn])
            setModalVisible(true)
            return
        } else {
            for (id in ingredients) {
                if (ingredients[id] === 0) {
                    setModalMessage(Strings.English.messages.ingredientsAmounts)
                    setModalButtons([modalOkayBtn])
                    setModalVisible(true)
                    return
                }
            }
            let recipe = {
                title: title,
                note: note,
                time: {
                    hour: hour,
                    minute: minute,
                    amount: amountPerTime
                },
                wage: wage,
                profitPercent: profitPercent,
                profitAmount: profitAmount,
                ingredients: ingredients,
                inventory: prodInventory
            }
            if (prefLogin === Strings.util.logins[0]) {
                let allIngObj = allIngredients;
                let allProdObj = products;
                let recId = prodId ? prodId : uuid.v4();
                allProdObj[recId] = recipe;
                storeRec(allProdObj);
                for (id in allIngredients) {
                    let inUse = id in ingredients
                    if (inUse) {
                        allIngObj[id].recipes[recId] = true
                    } else {
                        delete allIngObj[id].recipes[recId]
                    }
                }
                storeIng(allIngObj);
            } else if (prefLogin !== Strings.util.logins[0]) {
                if (prodId) {
                    firebaseInit.dbMethods.updateRecipe(user.uid, prodId, recipe);
                    for (id in allIngredients) {
                        let inUse = id in ingredients
                        firebaseInit.dbMethods.updateIRCrossRef(user.uid, id, prodId, inUse)
                    } 
                } else {
                    let newRec = await firebaseInit.dbMethods.newRecipe(user.uid, recipe);
                    for (id in allIngredients) {
                        let inUse = id in ingredients
                        firebaseInit.dbMethods.updateIRCrossRef(user.uid, id, newRec, inUse)
                    } 
                }
            }
            navigation.navigate("Home")
        }
    }

    const calculateTotalCost = () => {
        let ingCost = Calculate.ingredientCost(ingredients, allIngredients);
        let wageCost = Calculate.wagePerItem(wage, hour, minute, amountPerTime);
        return Calculate.totalCost(wageCost, ingCost)
    }
    
    let deleteBtn = {
        title: Strings.English.buttons.delete,
        color: Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {

            if (prefLogin === Strings.util.logins[0]) {
                let allIngObj = allIngredients;
                let allProdObj = products;
                delete allProdObj[recId]
                storeRec(allProdObj);
                for (id in allIngredients) {
                    delete allIngObj[id].recipes[recId]
                }
                storeIng(allIngObj);
            } else if (prefLogin !== Strings.util.logins[0]) {
                firebaseInit.dbMethods.deleteRecipe(user.uid, prodId);
                for (id in allIngredients) {
                    firebaseInit.dbMethods.updateIRCrossRef(user.uid, id, prodId, false);
                }
            }
            navigation.goBack()
        }
    }
    let cancelBtn = {
        title: Strings.English.buttons.cancel,
        color: Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.goBack()
        }
    }
    let createBtn = {
        title: Strings.English.buttons.save,
        color: Colors.lightTheme.buttons.save,
        iconName: Icons.save,
        onPress: () => {
            saveRecipe()
        },
        disabled: !canSave
    }
    let duplicateBtn = {
        title: Strings.English.buttons.duplicate,
        color: Colors.lightTheme.buttons.duplicate,
        iconName: Icons.duplicate,
        onPress: () => {
            setProdId("")
            setName(name + Strings.English.placeholder.duplicate)
        }
    }
    let modalCancelBtn = {
        title: Strings.English.buttons.cancel,
        color: Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            closeModal();
            setIngId("");
            setIngName("");
            setIngUnit("");
            setIngCost(0);
            setIngPerItem(0);
        }
    }
    let modalOkayBtn = {
        title: Strings.English.buttons.okay,
        color: Colors.lightTheme.buttons.cancel,
        iconName: Icons.okay,
        onPress: () => {
            closeModal();
        }
    }
    let newIngredientBtn = {
        title: Strings.English.buttons.newIngredient,
        color: Colors.lightTheme.buttons.newIngredient,
        iconName: Icons.create,
        onPress: () => {
            setModalMessage(Strings.English.label.newIngredient);
            setModalInputs([
                {label: Strings.English.label.ingName, default: "", maxChar: DataLimits.inputs.ingNameMax, onChange: (text) => {setIngName(text)}},
                {label: Strings.English.label.ingUnit, default: "", maxChar: DataLimits.inputs.ingUnitMax, onChange: (text) => {setIngUnit(text)}},
                {label: Strings.English.label.ingCost, default: "", maxChar: DataLimits.inputs.ingCostMax, onChange: (text) => {
                    setIngCost(Calculate.getNum(text));
                }, keyboardType: "decimal-pad"},
                {label: Strings.English.label.inventory, default: "", maxChar: DataLimits.inputs.ingInventoryMax, onChange: (text) => {
                    setIngInventory(Calculate.getNum(text));
                }, keyboardType: "decimal-pad"}
            ])
            setModalPickers([]);
            setModalButtons([modalCancelBtn]);
        }
    }
    let removeIngredientBtn = {
        title: Strings.English.buttons.remove,
        color: Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
            let copy = {...ingredients}
            delete copy[ingId];
            setIngredients(copy)
            closeModal();
            setIngId("");
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

    let modalSaveAmountBtn = {
        title: Strings.English.buttons.save,
        color: Colors.lightTheme.buttons.create,
        iconName: Icons.create,
        onPress: () => {
            saveAmount();
            closeModal();
        }
    }

    let navBtns = prodId ? [ deleteBtn, cancelBtn, duplicateBtn, createBtn ] : [ cancelBtn, createBtn ]
    return <SafeAreaView style={[containers.safeArea, {backgroundColor: Colors.lightTheme.background}]}> 
         <View style={containers.projArea}>
         <ScrollView>
            <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>{Strings.English.label.prodName}</Text>
            <TextInput
                accessibilityLabel={Strings.English.label.prodName}
                accessibilityHint={Strings.English.placeholder.prodName}
                style={[inputStyles.inputField, inputStyles.longInputs, {marginBottom: 10}, {color: Colors.lightTheme.text}]}
                placeholder={Strings.English.placeholder.prodName}
                value={name}
                autoCapitalize={'words'}
                onChangeText={(text) => {
                    if (!text.length) {
                        setName("")
                    } else if (text.trim().length > DataLimits.inputs.recNameMax) {
                        setName(text.trim().slice(0,DataLimits.inputs.recNameMax))
                    } else {
                        setName(text)
                    }
                }}
            />
            <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                {Strings.English.label.time}
            </Text>
            <View style={rows.row1}>
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.hour}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.hour}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text, marginEnd: 10}]}
                    value={hour.toString()}
                    placeholder={'1'}
                    maxLength={2}
                    keyboardType={'number-pad'}
                    onChangeText={text => {
                        if (text.length === 0) {
                            setHour(0)
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setHour(Calculate.getNum(text))
                        }
                    }}
                />
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.minute}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.minute}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text, marginEnd: 10}]}
                    value={minute.toString()}
                    placeholder={'15'}
                    maxLength={2}
                    keyboardType={'number-pad'}
                    onChangeText={text => {
                        if (text.length === 0) {
                            setMinute(0)
                        } else if (Strings.util.regex.numbers.test(text)) {
                            let num = Calculate.getNum(text);
                            if (num >= 60) {
                                setMinute(59)
                            } else {
                                setMinute(num)
                            }
                        }
                    }}
                />
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.amount}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.amount}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
                    value={amountPerTime.toString()}
                    placeholder={'1'}
                    maxLength={6}
                    keyboardType={'number-pad'}
                    onChangeText={text => {
                        if (text.length === 0) {
                            setAmountPerTime(0)
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setAmountPerTime(Calculate.getNum(text))
                        }
                    }}
                />
                {/* <Text style={textStyles.hintText}>
                    {Strings.English.hint.amount}
                </Text> */}
            </View>
            <View style={rows.row1} >
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.wage}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.wage}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
                    value={wage.toString()}
                    placeholder={'15.00'}
                    keyboardType={'decimal-pad'}
                    onChangeText={text => {
                        if (text.length === 0) {
                            setWage(0)
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setWage(Calculate.getNum(text))
                        }
                    }}
                />
            </View>
            <View style={rows.row1} >
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.profit}
                </Text>
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.profAmount}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.profit}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
                    defaultValue={profitAmount.toString().slice(0,10)}
                    placeholder={'0'}
                    maxLength={10}
                    keyboardType={'decimal-pad'}
                    onChangeText={text => {
                        if (text.length === 0) {
                            setProfitAmount(0)
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setProfitAmount(Calculate.getNum(text))
                        }
                    }}
                    onBlur={() => {
                        profitAmount && totalCost ? setProfitPercent(Calculate.shortenNum(profitAmount/totalCost*100)) : setProfitPercent(0) 
                    }}
                />
                <Text>
                    {"  =  "}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.profPercent}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
                    value={profitPercent.toString()}
                    placeholder={'0'}
                    maxLength={10}
                    keyboardType={'decimal-pad'}
                    onChangeText={text => {
                        if (text.length === 0) {
                            setProfitPercent(0)
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setProfitPercent(Calculate.getNum(text))
                        }
                    }}
                    onBlur={() => {
                        profitPercent && totalCost? setProfitAmount(Calculate.shortenNum(profitPercent/100*totalCost)) : setProfitAmount(0)
                    }}
                />
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.profPercent}
                </Text>
            </View>
            <View style={rows.row1} >
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.inventory}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.inventory}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
                    value={prodInventory.toString()}
                    placeholder={'0'}
                    keyboardType={'number-pad'}
                    onChangeText={text => {
                        if (text.length === 0) {
                            setProdInventory(0)
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setProdInventory(Calculate.getNum(text))
                        }
                    }}
                />
            </View>
            {/* <Text>{totalCost+profitAmount}</Text> */}
            <View>
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.ingredients}
                </Text>
                {ingTextList.length > 0 && ingTextList.map(item => item)}
                <Pressable 
                    style={[buttonStyles.basicButton, {backgroundColor: Colors.lightTheme.buttons.addIngredient}]}
                    onPress={() => {
                        setModalMessage(Strings.English.messages.ingredients)
                        setModalPickers( createIngPickers() );
                        setModalButtons(maxIng ? [modalCancelBtn] : [modalCancelBtn, newIngredientBtn]);
                        setModalBtnsVertical(true);
                        setModalVisible(true);
                    }}
                >
                    <Text>
                        {Strings.English.buttons.addIngredient}
                    </Text>
                </Pressable>
            </View>
            <KeyboardAvoidingView
                keyboardVerticalOffset={100}
                behavior={'padding'}
                // style={[{backgroundColor: "orange", opacity: 1, zIndex: 40}]}
            >
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>{Strings.English.label.prodNote}</Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.prodNote}
                    accessibilityHint={Strings.English.placeholder.prodNote}
                    style={[inputStyles.inputField, inputStyles.longInputs, {marginBottom: 10}, {color: Colors.lightTheme.text}]}
                    placeholder={Strings.English.placeholder.prodNote}
                    value={note}
                    autoCapitalize={'sentences'}
                    multiline={true}
                    onChangeText={(text) => {
                        if (!text.length) {
                            setNote("")
                        } else if (text.trim().length > DataLimits.inputs.recNoteMax) {
                            setNote(text.trim().slice(0,DataLimits.inputs.recNoteMax))
                        } else {
                            setNote(text)
                        }
                    }}
                />
            </KeyboardAvoidingView>
            </ScrollView>
        </View>
        <Modal 
            visible={modalVisible} 
            message={modalMessage} 
            pickers={modalPickers}
            inputs={modalInputs}
            buttons={modalButtons} 
            vertical={modalBtnsVertical}
            darkmode={false}
        />
        {Platform.OS === 'ios' && <ButtonBar buttons={navBtns} />}
        {Platform.OS === 'android' && !keyboardOut && <ButtonBar buttons={navBtns} />}
    </SafeAreaView>
}