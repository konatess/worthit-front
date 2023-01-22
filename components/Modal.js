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

export default ({visible, message, pickers, inputs, buttons, vertical, darkmode}) => {
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
				<View style={[containers.modalArea, {backgroundColor: Colors.lightTheme.background}]}>
					{message !== '' && <Text style={[textStyles.modalMsgText, {color: Colors.lightTheme.text}]}>{message}</Text>}
					{(pickers.length > 0) && <View style={containers.pickerArea}>
						<ScrollView>
							{pickers.map((item, index) => {
								return <Pressable key={"picker-" + index} style={buttonStyles.pickerButton} onPress={item.onPress}>
									<Text style={[textStyles.pickerText, {color: Colors.lightTheme.text}]}>
										{item.name}
									</Text>
								</Pressable>
							})}
						</ScrollView>
					</View>}
					{(inputs.length > 0) && inputs.map((unit, index) => {
						return ( <View style={rows.rowModal} key={"input" + index}>
							<Text style={[textStyles.labelText, {color: Colors.lightTheme.text}]} key={unit.label}>{unit.label}</Text>
							<TextInput
								accessibilityLabel={unit.label}
								key={unit.label + '-input'}
								keyboardType={unit.keyboardType || 'default'}
								style={[inputStyles.inputField, {color: Colors.lightTheme.text}]}
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
										<Text style={textStyles.modalBtnText}>
											{unit.iconName && <ButtonIcon 
												name={unit.iconName} 
												size={iconSizes.modalIconSize} 
												color={Colors.lightTheme.text}
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