import { useContext, useEffect, useState } from "react";
import { SafeAreaView, View, StatusBar, FlatList, Alert, Text } from "react-native";
import Purchases from "react-native-purchases";
import ButtonBar from '../components/ButtonBar';
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import PackageItem from "../components/PackageItem";
import { containers, textStyles } from "../constants/Styles";
import { UserContext } from "../constants/UserContext";
import { Entitlements } from "../constants/EntitlementsContext";
import { SettingsContext } from "../constants/SettingsContext";

export default function PurchaseScreen ({ route, navigation }) {
    const { settingsObj, setSettingsObj } = useContext(SettingsContext);
    const { user } = useContext(UserContext);
    const { entitlements, setEntitlements } = useContext(Entitlements);
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const getPackages = async () => {
            try {
                const offerings = await Purchases.getOfferings();
                if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                    setPackages(offerings.current.availablePackages);
                }
            } catch (e) {
                Alert.alert(Strings[settingsObj.language].headers.errorAlert, e.message)
            }
          };
      
          getPackages();
    }, []);

    // useEffect(() => { // TODO: Change so that users can be on page if they have already purchased 
    //     // a subscription and are returning to the page, but are redirected if they have just 
    //     // purchased a new subscription.
    //     if (entitlements.storage1) {
    //         if (!user.uid) {
    //             let obj = {...settingsObj}
    //             if (obj.login === Strings.util.logins[0]) {
    //                 obj.login = Strings.util.logins[1]
    //             }
    //             setSettingsObj(obj);
    //             navigation.push(Strings.util.routes.login)
    //         } else {
    //             navigation.push(Strings.util.routes.home)
    //         }
    //     }
    // }, [entitlements.storage1]);

    let cancelBtn = {
        title: Strings.English.buttons.cancel,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.cancel : Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.pop()
        },
        darkMode: settingsObj.darkMode
    }

    let restoreBtn = {
        title: Strings.English.buttons.restoreP,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.restoreP : Colors.lightTheme.buttons.restoreP,
        iconName: Icons.restore,
        onPress: async () => {
            try {
                await Purchases.restorePurchases();
            } catch (e) {
                Alert.alert(Strings[settingsObj.language].headers.errorAlert, e.message);
            }
        },
        darkMode: settingsObj.darkMode
    }

    let stopBtn = {
        title: Strings.English.buttons.stopSub,
        color: settingsObj.darkMode ? Colors.darkTheme.buttons.delete : Colors.lightTheme.buttons.delete,
        iconName: Icons.delete,
        onPress: async () => {
            let supported = await Linking.canOpenURL(entitlements.subsURL);
            if (supported) {
                await Linking.openURL(entitlements.subsURL)
            }
            else {
                Alert.alert(Strings[language].headers.errorAlert, entitlements.subsURL);
            }
        },
        darkMode: settingsObj.darkMode
    }

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: settingsObj.darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        <StatusBar 
            barStyle={settingsObj.darkMode ? 'light-content' : 'dark-content'}
        />
        {Platform.OS === 'android' && <View style={{height: StatusBar.currentHeight}} />}
        <Text style={[textStyles.headerText, {color: settingsObj.darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{Strings.English.headers.subs}</Text>
        <View>
            {packages.length > 0 && <FlatList 
                style={containers.settingsBtnList}
                contentContainerStyle={{paddingBottom: 30, paddingTop: 10}}
                data={packages}
                renderItem={({ item, index }) => <PackageItem 
                    packageItem={item} 
                    onSelection={async () => {
                        try {
                            const { purchaserInfo } = await Purchases.purchasePackage(item);
                            if (typeof purchaserInfo.entitlements.active[Strings.util.entitlements.storage1] !== 'undefined') {
                                let ent = { ...entitlements}
                                ent.storage1 = true
                                setEntitlements(ent);
                            }
                        } catch (e) {
                            if (!e.userCancelled) {
                                Alert.alert(Strings[language].headers.errorAlert, e.message)
                            }
                        } finally {
                            if (!user.uid) {
                                let obj = {...settingsObj}
                                if (obj.login === Strings.util.logins[0]) {
                                    obj.login = Strings.util.logins[1]
                                }
                                setSettingsObj(obj);
                                navigation.push(Strings.util.routes.login)
                            } else {
                                navigation.push(Strings.util.routes.home)
                            }
                        }
                    }}
                    isLast={index === packages.length -1}
                    // ListFooterComponent={() => {}}
                />}
                keyExtractor={(item) => item.identifier}
            />}
            {/* <Text>{typeof entitlements.subsURL}</Text> */}
        </View>
        <ButtonBar buttons={entitlements.subsURL.length ? [cancelBtn, stopBtn, restoreBtn] : [cancelBtn, restoreBtn]} />
    </SafeAreaView>
}


// {
//     "all": {
//         "10x_storage": {
//             "annual": null, 
//             "availablePackages": [Array], 
//             "identifier": "10x_storage", 
//             "lifetime": null, 
//             "monthly": [Object], 
//             "serverDescription": "10x Storage and Database Backup", 
//             "sixMonth": null, 
//             "threeMonth": null, 
//             "twoMonth": null, 
//             "weekly": null
//         }
//     }, 
//     "current": {
//         "annual": null, 
        // "availablePackages": [
        //     {
        //         "identifier": "$rc_monthly", 
        //         "offeringIdentifier": "10x_storage", 
        //         "packageType": "MONTHLY", 
        //         "product": {
        //             "currencyCode": "USD", 
        //             "description": "", 
        //             "discounts": null, 
        //             "identifier": "wi_fb_10x", 
        //             "introPrice": null, 
        //             "price": 0.99, 
        //             "priceString": "$0.99", 
        //             "productCategory": "SUBSCRIPTION", 
        //             "productType": "AUTO_RENEWABLE_SUBSCRIPTION", 
        //             "subscriptionPeriod": "P1M", 
        //             "title": "Database Backup and 10x Storage (Worth It)"
        //         }
        //     }
        // ], 
//         "identifier": "10x_storage", 
//         "lifetime": null, 
//         "monthly": {
//             "identifier": "$rc_monthly", 
//             "offeringIdentifier": "10x_storage", 
//             "packageType": "MONTHLY", 
//             "product": [Object]
//         }, 
//         "serverDescription": "10x Storage and Database Backup", 
//         "sixMonth": null, 
//         "threeMonth": null, 
//         "twoMonth": null, 
//         "weekly": null
//     }
// }