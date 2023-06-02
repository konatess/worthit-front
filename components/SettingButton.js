import { Text, Pressable } from "react-native";
import ButtonIcon from "./ButtonIcon";
import { buttonStyles, iconSizes, textStyles } from "../constants/Styles";
import Colors from "../constants/Colors";

export default function SettingButton ({ title, iconName, onPress, darkMode }) {
    return <Pressable style={ [buttonStyles.settingsBtnArea, (iconName === "globe") && buttonStyles.settingslastBtn, {borderColor: Colors.lightTheme.buttons.emptyBtnBorders} ]} onPress={onPress}>
        <ButtonIcon name={iconName} size={iconSizes.settingsIconSize} color={darkMode ? Colors.darkTheme.text : Colors.lightTheme.text} style={buttonStyles.settingsIconArea} />
        <Text style={[textStyles.settingsBtnText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{title}</Text>
    </Pressable>
}