import { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import Notify from './Notify';
import Purchases from 'react-native-purchases';
import { textStyles, buttonStyles } from '../constants/Styles';
import Strings from '../constants/Strings';
import { Entitlements } from "../constants/EntitlementsContext";

export default function PackageItem ({ purchasePackage, setIsPurchasing, language, toLogin, toHome, isLast, isAnonymous }) {
    const { entitlements, setEntitlements } = useContext(Entitlements);
    
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
                Notify.showError(language, e.message);
            }
        } finally {
            setIsPurchasing(false);
        }
    };
    
    return (
        <Pressable onPress={onSelection} style={[buttonStyles.purchaseBtnArea, isLast && buttonStyles.settingslastBtn]}>
            <View>
                <Text style={textStyles.productTitleText}>{title}</Text>
                <Text style={textStyles.productDescText}>{description}</Text>
            </View>
            <Text style={textStyles.productPriceText}>{priceString}</Text>
        </Pressable>
    );
}