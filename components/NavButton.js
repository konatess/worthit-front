import { Text, Pressable } from "react-native";
import ButtonIcon from "./ButtonIcon";
import { buttonStyles, iconSizes } from "../constants/Styles";
import Colors from "../constants/Colors";

export default function NavButton ({ title, color, iconName, onPress, darkMode }) {
    return <Pressable style={ [buttonStyles.navBtn, {backgroundColor: color}]} onPress={onPress}>
        <ButtonIcon name={iconName} size={iconSizes.navIconSize} color={darkMode ? Colors.darkTheme.text : Colors.lightTheme.text }  style={{ marginBottom: -3 }}/>
        <Text style={{color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text }}>{title}</Text>
    </Pressable>
}