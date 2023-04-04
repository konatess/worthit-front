import { View, Text, Pressable } from 'react-native';
import Notify from './Notify';
import Purchases from 'react-native-purchases';
import { textStyles, buttonStyles } from '../constants/Styles';

export default function PackageItem ({ purchasePackage, setIsPurchasing, language, toLogin, isLast }) {
    const {
        product: { title, description, priceString },
    } = purchasePackage;

    const onSelection = async () => {
        setIsPurchasing(true);
    
        try {
            const { purchaserInfo } = await Purchases.purchasePackage(purchasePackage);
        
            if (typeof purchaserInfo.entitlements.active['10x_storage'] !== 'undefined') {
                toLogin();
            }
        } catch (e) {
            if (!e.userCancelled) {
                // Alert.alert('Error purchasing package', e.message);
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