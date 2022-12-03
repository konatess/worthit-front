import { Text, Pressable, View } from "react-native";
import Colors from "../constants/Colors";
import { textStyles, rows } from "../constants/Styles";

export default function IngAmount ({ id, name, amount, onPress }) {
    return <View style={[rows.row1, {marginLeft: 20}]} key={id}>
        <Pressable onPress={onPress}>
            <Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]}>{amount + " -- " + name}</Text>
        </Pressable>
    </View> 
}