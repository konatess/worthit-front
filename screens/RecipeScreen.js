import { useState, useEffect } from "react";
import { Text, SafeAreaView, View, TextInput, Keyboard, Pressable } from "react-native";

import ButtonBar from '../components/ButtonBar';
import { containers, textStyles, inputStyles, rows, buttonStyles } from '../constants/Styles';
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import Modal from "../components/Modal";

export default function RecipeScreen ({navigation, route}) {
    const { allIngredients, prodObj } = route.params
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtons, setModalButtons] = useState([]);
	const [modalPickers, setModalPickers] = useState([]);
    const [modalInputs, setModalInputs] = useState([]);
    const [name, setName] = useState(prodObj ? prodObj.name : "");
    const [note, setNote] = useState(prodObj ? prodObj.note : "");
    const [hour, setHour] = useState(prodObj ? prodObj.hour : 0);
    const [minute, setMinute] = useState(prodObj ? prodObj.minute : 0);
    const [amountPerTime, setAmountPerTime] = useState(prodObj ? prodObj.amount : 1)
    const [wage, setWage] = useState(prodObj ? prodObj.wage : 15.00);
    const [profitPercent, setProfitPercent] = useState(prodObj ? prodObj.profitPercent : 0);
    const [profitAmount, setProfitAmount] = useState(prodObj ? prodObj.profitAmount : 0);
    const [ingredients, setIngredients] = useState(prodObj ? prodObj.ingredients : {});
    const [ingTextList, setIngTextList] = useState([])
    const [ingName, setIngName] = useState("");
    const [ingUnit, setIngUnit] = useState("");
    const [ingCost, setIngCost] = useState(0);
    const [ingPerItem, setIngPerItem] = useState(0);

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
        }
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
            setModalVisible(false);
            setModalMessage("");
            setModalPickers([]);
            setModalButtons([]);
        }
    }
    let newIngredientBtn = {
        title: Strings.English.buttons.newIngredient,
        color: Colors.lightTheme.buttons.newIngredient,
        iconName: Icons.create,
        onPress: () => {
            setModalMessage(Strings.English.label.newIngredient);
            setModalInputs([
                {label: Strings.English.label.ingName, default: "", onChange: setIngName},
                {label: Strings.English.label.ingUnit, default: "", onChange: setIngUnit},
                {label: Strings.English.label.ingCost, default: 0, onChange: setIngCost, keyboardType: "decimal-pad"}
            ])
            setModalPickers([]);
            setModalButtons([modalCancelBtn]);
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
                    value={hour}
                    placeholder={'1'}
                    keyboardType={'number-pad'}
                    onChangeText={text => {
                        if (text.length === 0 || !Strings.util.regex.numbers.test(text)) {
                            setHour(text)
                        }
                    }}
                />
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.minute}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.minute}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text, marginEnd: 10}]}
                    value={minute}
                    placeholder={'15'}
                    keyboardType={'number-pad'}
                    onChangeText={text => {
                        if (text.length === 0 || !Strings.util.regex.numbers.test(text)) {
                            setMinute(text)
                        }
                    }}
                />
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.amount}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.amount}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
                    value={amountPerTime}
                    placeholder={'1'}
                    keyboardType={'number-pad'}
                    onChangeText={text => {
                        if (text.length === 0 || !Strings.util.regex.numbers.test(text)) {
                            setAmountPerTime(text)
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
                    value={wage}
                    placeholder={'15.00'}
                    keyboardType={'decimal-pad'}
                    onChangeText={text => {
                        if (text.length === 0 || !Strings.util.regex.numbers.test(text)) {
                            setWage(text)
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
                    value={profitAmount}
                    placeholder={'0'}
                    keyboardType={'decimal-pad'}
                    onChangeText={text => {
                        if (text.length === 0 || !Strings.util.regex.numbers.test(text)) {
                            setProfitAmount(text)
                        }
                    }}
                />
                <Text>
                    {"  =  "}
                </Text>
                <TextInput
                    accessibilityLabel={Strings.English.label.profPercent}
                    style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
                    value={profitPercent}
                    placeholder={'0'}
                    keyboardType={'decimal-pad'}
                    onChangeText={text => {
                        if (text.length === 0 || !Strings.util.regex.numbers.test(text)) {
                            setProfitPercent(text)
                        }
                    }}
                />
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.profPercent}
                </Text>
            </View>
            <View>
                <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                    {Strings.English.label.ingredients}
                </Text>
                {/* {ingredients && ingredients.map(ing => {
                    return <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                        {ing.amount + " -- " + ing.name}
                    </Text>
                })} */}
                {ingTextList.length > 0 && ingTextList.map(item => item)}
                <Pressable 
                    style={[buttonStyles.basicButton, {backgroundColor: Colors.lightTheme.buttons.addIngredient}]}
                    onPress={() => {
                        setModalMessage(Strings.English.messages.ingredients)
                        // setModalPickers(allIngredients.length < 1 ? [] : allIngredients.map(ing => {
                        //     return {
                        //         name: ing.name,
                        //         onPress: () => {
                        //             ingredients.push(ing.name)
                        //             setModalVisible(false);
                        //             setModalButtons([]);
                        //             setModalPickers([]);
                        //         }
                        //     }
                        // }))
                        setModalPickers(() => {
                            let ingList = [];
                            for (const id in allIngredients) {
                                let ing = {
                                    id: id,
                                    amount: 0,
                                    name: allIngredients[id].name,
                                    onPress: () => {
                                        setModalVisible(false)
                                        setIngTextList(ingTextList.concat(<Text key={id} style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>
                                            {0 + "--" + allIngredients[id].name}
                                        </Text>))
                                        return (id in ingredients) ? null : ingredients[id] = 0;
                                    }
                                }
                                ingList.push(ing)
                            }
                            return ingList
                        })
                        setModalButtons([modalCancelBtn, newIngredientBtn]);
                        setModalVisible(true);
                    }}
                >
                    <Text>
                        {Strings.English.buttons.addIngredient + " " + modalVisible}
                    </Text>
                </Pressable>
            </View>
        </View>
        <Modal 
            visible={modalVisible} 
            message={modalMessage} 
            pickers={modalPickers}
            inputs={modalInputs}
            buttons={modalButtons} 
            vertical={true}
            darkmode={false}
        />
        {Platform.OS === 'ios' && <ButtonBar buttons={navBtns} />}
        {Platform.OS === 'android' && !keyboardOut && <ButtonBar buttons={navBtns} />}
    </SafeAreaView>
}