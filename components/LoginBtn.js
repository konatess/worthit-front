import { Pressable, Text } from "react-native";
import { iconSizes, buttonStyles } from "../constants/Styles";
import Colors from "../constants/Colors";
import ButtonIcon from "./ButtonIcon";

export default function LoginButton({iconName, onPress}) {

	return (
		<Pressable
			style={buttonStyles.loginButton}
			onPress={onPress}
		> 
			<ButtonIcon 
				name={iconName} 
				size={iconSizes.loginIconSize} 
				color={Colors.lightTheme.text}  
				style={{ margin: 5 }} 
			/>
		</Pressable>
	);
}