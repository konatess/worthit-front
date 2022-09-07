import { Text, SafeAreaView } from "react-native";

import ButtonBar from '../components/ButtonBar';
import { containers } from '../constants/Styles';
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";


export default function HomeScreen ({ navigation }) {
    let settingsbtn = {
        title: "Settings",
        color: Colors.lightTheme.buttons.settings,
        iconName: Icons.settings,
        onPress: () => {
            navigation.navigate("Settings")
        }
    }
    let createbtn = {
        title: "Create",
        color: Colors.lightTheme.buttons.create,
        iconName: Icons.create,
        onPress: () => {
            navigation.navigate("Recipe", {
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
                    }
                ]
            })
        }
    }
    return <SafeAreaView style={[containers.safeArea, {backgroundColor: Colors.lightTheme.background}]}> 
        <Text> HomeScreen </Text>
        <ButtonBar buttons={[settingsbtn, createbtn]} />
    </SafeAreaView>
}