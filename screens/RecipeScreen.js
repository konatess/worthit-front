import { useState, useEffect, useContext } from "react";
import { Text, SafeAreaView, View, TextInput, Keyboard, Pressable } from "react-native";

import ButtonBar from '../components/ButtonBar';
import { containers, textStyles, inputStyles, rows, buttonStyles } from '../constants/Styles';
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import Modal from "../components/Modal";
import { UserContext } from "../constants/UserContext";
import { app } from "../storage/firebaseInit";
import { getDatabase, ref, set, push, onValue, get, child, remove } from 'firebase/database';
import IngAmount from "../components/IngAmount";

const database = getDatabase(app, "https://worth-888-default-rtdb.firebaseio.com/");

export default function RecipeScreen ({navigation, route}) {
    const { knownIng, prodObj } = route.params;
    const { user } = useContext(UserContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtons, setModalButtons] = useState([]);
	const [modalPickers, setModalPickers] = useState([]);
    const [modalInputs, setModalInputs] = useState([]);
    const [modalBtnsVertical, setModalBtnsVertical] = useState(false);
    const [canSave, setCanSave] = useState(false)
    const [allIngredients, setAllIngredients] = useState(knownIng);
    const [name, setName] = useState(prodObj ? prodObj.name : "");
    const [note, setNote] = useState(prodObj ? prodObj.note : "");
    const [hour, setHour] = useState(prodObj ? prodObj.hour : 0);
    const [minute, setMinute] = useState(prodObj ? prodObj.minute : 0);
    const [amountPerTime, setAmountPerTime] = useState(prodObj ? prodObj.amount : 0)
    const [wage, setWage] = useState(prodObj ? prodObj.wage : 15.00);
    const [profitPercent, setProfitPercent] = useState(prodObj ? prodObj.profitPercent : 0);
    const [profitAmount, setProfitAmount] = useState(prodObj ? prodObj.profitAmount : 0);
    const [ingredients, setIngredients] = useState(prodObj ? prodObj.ingredients : {});
    const [ingTextList, setIngTextList] = useState([]);
    const [ingId, setIngId] = useState("");
    const [ingName, setIngName] = useState("");
    const [ingUnit, setIngUnit] = useState("");
    const [ingCost, setIngCost] = useState(0);
    const [ingPerItem, setIngPerItem] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    const [keyboardOut, setKeyboardOut] = useState(false);
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
        if (ingPerItem > 0) {
            modalBtns.push(modalSaveAmountBtn)
            setModalBtnsVertical(false)
        }
        setModalButtons(modalBtns);
    }, [ingPerItem])

    useEffect(() => {
        let list = [];
        for (const id in ingredients) {
            if (id) {
                list.push(<IngAmount 
                    id={id}
                    amount={ingredients[id]}
                    name={allIngredients[id].name}
                    onPress={() => {
                        setIngId(id)
                        setModalInputs([{
                            label: Strings.English.label.ingPerItem, 
                            default: ingredients[id] ? ingredients[id].toString() : "", 
                            onChange: text => {
                                setIngPerItem(getNum(text));
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

    // useEffect(() => {
    //     profitAmount && totalCost ? setProfitPercent(shortenNum(profitAmount/totalCost*100)) : setProfitPercent(0) 
    // }, [profitAmount])

    // useEffect(() => {
    //     profitPercent && totalCost? setProfitAmount(shortenNum(profitPercent/100*totalCost)) : setProfitAmount(0)
    // }, [profitPercent])

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
        profitPercent && totalCost? setProfitAmount(shortenNum(profitPercent/100*totalCost)) : setProfitAmount(0)
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
        let newCost = ingCost;
        if(newName.length === 0) {
            setModalMessage(Strings.English.messages.ingNameTooShort)
        } else if (Strings.util.regex.titles.test(newName)) {
            setModalMessage(Strings.English.messages.ingNameBadChar)
        } else if (newUnit.length === 0) {
            setModalMessage(Strings.English.messages.ingUnitTooShort)
        } else if (ingCost === 0) {
            setModalMessage(Strings.English.messages.ingCostZero)
        }
        let ing = {
            name: newName,
            unit: newUnit,
            cost: newCost,
        }
        if (ingId) {
            await set(ref(database, `users/${user.uid}/ingredients/${ingId}`), ing).catch(error => console.log(error.message))
        } else {
            await push(ref(database, `users/${user.uid}/ingredients`), ing).catch(error => console.log(error.message));
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

    const saveRecipe = () => {

    }

    const calculateTotalCost = () => {
        let cost = 0;
        cost += ((wage * hour) + (wage * minute / 60)) / amountPerTime
        for (const id in ingredients) {
            cost += ingredients[id] * allIngredients[id].cost
        }
        return cost
    }

    const getNum = (text) => {
        let trimmed = text.trim();
        let num = parseFloat(trimmed);
        return isNaN(num) ? 0 : num
    } 

    const shortenNum = (num) => {
        return parseFloat(num.toFixed(10))
    }
    
    let deleteBtn = {
        title: Strings.English.buttons.delete,
        color: Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: () => {
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
            navigation.navigate("Recipe")
        },
        disabled: !canSave
    }
    let duplicateBtn = {
        title: Strings.English.buttons.duplicate,
        color: Colors.lightTheme.buttons.duplicate,
        iconName: Icons.duplicate,
        onPress: () => {
            navigation.navigate("Home")
        }
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
    let newIngredientBtn = {
        title: Strings.English.buttons.newIngredient,
        color: Colors.lightTheme.buttons.newIngredient,
        iconName: Icons.create,
        onPress: () => {
            setModalMessage(Strings.English.label.newIngredient);
            setModalInputs([
                {label: Strings.English.label.ingName, default: "", maxChar: 50, onChange: (text) => {setIngName(text)}},
                {label: Strings.English.label.ingUnit, default: "", maxChar: 30, onChange: (text) => {setIngUnit(text)}},
                {label: Strings.English.label.ingCost, default: "", maxChar: 15, onChange: text => {
                    setIngCost(getNum(text));
                }, keyboardType: "decimal-pad"}
            ])
            setModalPickers([]);
            setModalButtons([modalCancelBtn]);
        }
    }
    let modalSaveIngBtn = {
        title: Strings.English.buttons.save,
        color: Colors.lightTheme.buttons.create,
        iconName: Icons.create,
        onPress: () => {
            saveIngredient(); 
            closeModal();
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

    // let navBtns = prodObj ? [ deleteBtn, cancelBtn, duplicateBtn, createBtn ] : [ cancelBtn, duplicateBtn, createBtn ]
    let navBtns = [ deleteBtn, cancelBtn, duplicateBtn, createBtn ]
    return <SafeAreaView style={[containers.safeArea, {backgroundColor: Colors.lightTheme.background}]}> 
         <View style={containers.projArea}>
            <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>{Strings.English.label.prodName}</Text>
            <TextInput
                accessibilityLabel={Strings.English.label.prodName}
                accessibilityHint={Strings.English.placeholder.prodName}
                style={[inputStyles.inputField, {marginBottom: 10}, {color: Colors.lightTheme.text}]}
                placeholder={Strings.English.placeholder.prodName}
                value={name}
                autoCapitalize={'words'}
                onChangeText={text => setName(text)}
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
                            setHour(getNum(text))
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
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setMinute(getNum(text))
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
                            setAmountPerTime(getNum(text))
                        }
                    }}
                />
                {/* <Text style={textStyles.hintText}>
                    {Strings.English.hint.amount}
                </Text> */}
            </View>
            <Text>{hour}</Text>
            <Text>{minute}</Text>
            <Text>{amountPerTime}</Text>
            <View style={rows.row1} >
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.wage}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.wage}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
                    placeholder={'15.00'}
                    keyboardType={'decimal-pad'}
                    onChangeText={text => {
                        if (text.length === 0) {
                            setWage(0)
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setWage(getNum(text))
                        }
                    }}
                />
            </View>
            <Text>{wage}</Text>
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
                            setProfitAmount(getNum(text))
                        }
                    }}
                    onBlur={() => {
                        profitAmount && totalCost ? setProfitPercent(shortenNum(profitAmount/totalCost*100)) : setProfitPercent(0) 
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
                            setProfitAmount(0)
                        } else if (text.length > 0 && Strings.util.regex.numbers.test(text)) {
                            setProfitPercent(getNum(text))
                        }
                    }}
                    onBlur={() => {
                        profitPercent && totalCost? setProfitAmount(shortenNum(profitPercent/100*totalCost)) : setProfitAmount(0)
                    }}
                />
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.profPercent}
                </Text>
            </View>
            <Text>{"Profit: $" + profitAmount + " = " + profitPercent + "%"}</Text>
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
                        setModalButtons([modalCancelBtn, newIngredientBtn]);
                        setModalVisible(true);
                    }}
                >
                    <Text>
                        {Strings.English.buttons.addIngredient}
                    </Text>
                </Pressable>
            </View>
            <Text>{"Total Cost: " + totalCost.toString()}</Text>
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