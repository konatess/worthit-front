import { Text, Pressable, View } from "react-native";
import Colors from "../constants/Colors";
import { buttonStyles, rows, textStyles } from "../constants/Styles";

export default function IngButton ({ keyid, name, unit, cost, onPress }) {
    return <Pressable key={keyid} style={ [buttonStyles.ingBtn]} onPress={onPress}>
        <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>{name}</Text>
        <Text>{cost + " / " + unit}</Text>
    </Pressable>
}