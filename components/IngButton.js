import { Text, Pressable } from "react-native";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import { buttonStyles, textStyles } from "../constants/Styles";

export default function IngButton ({ name, unit, cost, inventory, onPress }) {
    return <Pressable style={ [buttonStyles.ingBtn]} onPress={onPress}>
        <Text style={[textStyles.productTitleText, {color: Colors.lightTheme.text}]}>{name}</Text>
        <Text>{`$${cost} / ${unit}       ${Strings.English.label.inventory} ${inventory}`}</Text>
    </Pressable>
}