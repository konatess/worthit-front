import { Text, Pressable } from "react-native";
import ButtonIcon from "./ButtonIcon";
import { buttonStyles, iconSizes } from "../constants/Styles";
import Colors from "../constants/Colors";
import Icons from "../constants/Icons";

export default function NavButton ({ onPress, darkMode }) {
    return <Pressable style={[buttonStyles.infoBtn]} onPress={onPress}>
        <ButtonIcon name={Icons.info} size={iconSizes.infoIconSize} color={darkMode ? Colors.darkTheme.buttons.info : Colors.lightTheme.buttons.info }/>
    </Pressable>
}