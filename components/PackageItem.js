import { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { textStyles, buttonStyles } from '../constants/Styles';
import { SettingsContext } from '../constants/SettingsContext';
import Colors from '../constants/Colors';

export default function PackageItem ({ packageItem, onSelection, isLast }) {
    const { settingsObj } = useContext(SettingsContext);
    const {
        product: { title, description, priceString },
    } = packageItem;
    
    return (
        <Pressable onPress={onSelection} style={[
            buttonStyles.purchaseBtnArea, 
            isLast && buttonStyles.settingslastBtn, 
            {borderColor: settingsObj.darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}
        ]}>
            <View>
                <Text style={[textStyles.productTitleText, {color: settingsObj.darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{title}</Text>
                <Text style={[textStyles.productDescText, {color: settingsObj.darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{description}</Text>
            </View>
            <Text style={[textStyles.productPriceText, {color: settingsObj.darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{priceString}</Text>
        </Pressable>
    );
}