import { useContext } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Purchases from 'react-native-purchases';
import { textStyles, buttonStyles } from '../constants/Styles';
import Strings from '../constants/Strings';
import { Entitlements } from "../constants/EntitlementsContext";
import { SettingsContext } from '../constants/SettingsContext';
import Colors from '../constants/Colors';

export default function PackageItem ({ purchasePackage, setIsPurchasing, language, toLogin, toHome, isLast, isAnonymous }) {
    const { entitlements, setEntitlements } = useContext(Entitlements);
    const { settingsObj } = useContext(SettingsContext);
    
    const {
        product: { title, description, priceString },
    } = purchasePackage;

    const onSelection = async () => {
        setIsPurchasing(true);
    
        try {
            const { purchaserInfo } = await Purchases.purchasePackage(purchasePackage);
        
            if (typeof purchaserInfo.entitlements.active[Strings.util.entitlements.storage1] !== 'undefined') {
                let ent = { ...entitlements}
                ent.storage1 = true
                setEntitlements(ent);
                isAnonymous ? toLogin() : toHome();
            }
        } catch (e) {
            if (!e.userCancelled) {
                // Alert.alert(Strings[language].headers.errorAlert, e.message)
                Alert.alert("Purchase Item Error: ", e.message)
            }
        } finally {
            setIsPurchasing(false);
        }
    };
    
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