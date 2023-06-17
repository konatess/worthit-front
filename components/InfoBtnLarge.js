import { Text, Pressable } from "react-native";
import ButtonIcon from "./ButtonIcon";
import { buttonStyles, iconSizes } from "../constants/Styles";
import Colors from "../constants/Colors";
import Icons from "../constants/Icons";

export default function InfoButtonLarge ({ onPress, darkMode }) {
    return <Pressable style={[buttonStyles.infoBtnLarge]} onPress={onPress}>
        <ButtonIcon name={Icons.info} size={iconSizes.infoLargeIconSize} color={darkMode ? Colors.darkTheme.buttons.info : Colors.lightTheme.buttons.info }/>
    </Pressable>
}