import { Text, Pressable, View } from "react-native";
import Colors from "../constants/Colors";
import { buttonStyles, rows, textStyles } from "../constants/Styles";
import Strings from "../constants/Strings";

export default function ProdButton ({ title, onPress, price, profitAmount, inventory, darkMode }) {
    return <Pressable style={ [buttonStyles.prodBtn, {borderColor: Colors.lightTheme.buttons.emptyBtnBorders}]} onPress={onPress}>
        {/* <Text style={[textStyles.productTitleText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{title}</Text> */}
        <Text style={[textStyles.productTitleText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{title}</Text>
        <Text style={[textStyles.productDescText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>
            {`${Strings.English.label.price}$${price}  ${Strings.English.label.profit}$${profitAmount}  ${Strings.English.label.inventory}${inventory}`}
        </Text>
    </Pressable>
}