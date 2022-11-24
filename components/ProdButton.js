import { Text, Pressable, View } from "react-native";
import Colors from "../constants/Colors";
import { buttonStyles, rows, textStyles } from "../constants/Styles";

export default function ProdButton ({ title, onPress }) {
    return <Pressable style={ [buttonStyles.prodBtn]} onPress={onPress}>
        <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>{title}</Text>
    </Pressable>
}