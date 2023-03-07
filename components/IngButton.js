import { Text, Pressable } from "react-native";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import { buttonStyles, textStyles } from "../constants/Styles";

export default function IngButton ({ name, unit, cost, inventory, onPress, darkMode }) {
    return <Pressable style={ [buttonStyles.ingBtn, {borderColor: Colors.lightTheme.buttons.emptyBtnBorders}]} onPress={onPress}>
        <Text style={[textStyles.productTitleText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{name}</Text>
        <Text style={{color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}}>{`$${cost} / ${unit}       ${Strings.English.label.inventory} ${inventory}`}</Text>
    </Pressable>
}