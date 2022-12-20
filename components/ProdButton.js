import { Text, Pressable, View } from "react-native";
import Colors from "../constants/Colors";
import { buttonStyles, rows, textStyles } from "../constants/Styles";

export default function ProdButton ({ title, onPress, price, profitAmount }) {
    return <Pressable style={ [buttonStyles.prodBtn]} onPress={onPress}>
        <Text style={[textStyles.productTitleText, {color: Colors.lightTheme.text}]}>{title}</Text>
        <Text style={[textStyles.productPriceText, {color: Colors.lightTheme.text}]}>{`Price: $${price}  Profit: $${profitAmount}`}</Text>
    </Pressable>
}