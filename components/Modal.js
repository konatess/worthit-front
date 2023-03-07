import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
	KeyboardAvoidingView,
	Platform
} from "react-native";
import { containers, rows, buttonStyles, textStyles, inputStyles, iconSizes } from "../constants/Styles";
import ButtonIcon from "./ButtonIcon";
import Colors from "../constants/Colors";

export default ({visible, message, pickers, inputs, buttons, vertical, darkMode}) => {
	return <Modal
		animationType="slide"
		transparent={true}
		visible={visible}
	>
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{flex: 1}}
		>
			<View style={containers.centerModal}>
				<View style={[containers.modalArea, {backgroundColor: darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}>
					{message !== '' && <Text style={[textStyles.modalMsgText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{message}</Text>}
					{(pickers.length > 0) && <View style={[containers.pickerArea, {borderColor: Colors.lightTheme.buttons.emptyBtnBorders}]}>
						<ScrollView>
							{pickers.map((item, index) => {
								return <Pressable key={"picker-" + index} style={[buttonStyles.pickerButton, {borderColor: Colors.lightTheme.buttons.emptyBtnBorders}]} onPress={item.onPress}>
									<Text style={[textStyles.pickerText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>
										{item.name}
									</Text>
								</Pressable>
							})}
						</ScrollView>
					</View>}
					{(inputs.length > 0) && inputs.map((unit, index) => {
						return ( <View style={rows.rowModal} key={"input" + index}>
							<Text style={[textStyles.labelText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]} key={unit.label}>{unit.label}</Text>
							<TextInput
								accessibilityLabel={unit.label}
								key={unit.label + '-input'}
								keyboardType={unit.keyboardType || 'default'}
								style={[inputStyles.inputField, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}, {borderColor: Colors.lightTheme.inputBorder}]}
								placeholder={unit.placeholder}
								defaultValue={unit.default || ''}
								returnKeyType={'next'}
								multiline={true}
								maxLength={unit.maxChar}
								autoFocus={!index}
								autoCapitalize={'none'}
								onChangeText={unit.onChange}
							/>
						</View>	)})}
						<View style={[vertical ? rows.vertical : rows.rowModal, {marginTop: 10}]}>
							{buttons.map((unit, index) => {
								return (
									<Pressable
										key={"mb-" + index}
										style={[buttonStyles.modalButton, {backgroundColor: unit.color}]}
										onPress={unit.onPress}
									>
										<Text style={[textStyles.modalBtnText, {color: darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>
											{unit.iconName && <ButtonIcon 
												name={unit.iconName} 
												size={iconSizes.modalIconSize} 
												color={darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}
											/>}
											{"  " + unit.title}
										</Text>
									</Pressable>
								)
							})}
						</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	</Modal>
};