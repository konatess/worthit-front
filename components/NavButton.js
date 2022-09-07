import { Text, Pressable } from "react-native";
import ButtonIcon from "./ButtonIcon";
import { buttonStyles, iconSizes } from "../constants/Styles";
import Colors from "../constants/Colors";

export default function NavButton ({ title, color, iconName, onPress }) {
    return <Pressable style={ [buttonStyles.navBtn, {backgroundColor: color}]} onPress={onPress}>
        <ButtonIcon name={iconName} size={iconSizes.navIconSize} color={Colors.lightTheme.text}  style={{ marginBottom: -3 }}/>
        <Text style={{color: Colors.lightTheme.text}}>{title}</Text>
    </Pressable>
}