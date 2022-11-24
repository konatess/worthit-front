import { Text, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { buttonStyles, textStyles } from "../constants/Styles";

export default function IngButton ({ name, unit, cost, onPress }) {
    return <Pressable style={ [buttonStyles.ingBtn]} onPress={onPress}>
        <Text style={[textStyles.productTitleText, {color: Colors.lightTheme.text}]}>{name}</Text>
        <Text>{cost + " / " + unit}</Text>
    </Pressable>
}