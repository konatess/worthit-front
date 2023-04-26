import { useContext, useEffect, useState } from "react";
import { SafeAreaView, View, StatusBar, FlatList, Alert, Text } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
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
    const { entitlements, setEntitlements } = useContext(Entitlements)
    const [packages, setPackages] = useState([])
    const [isPurchsing, setIsPurchasing] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [revCatId, setRevCatId] = useState(null);
    const [subscriptionActive, setSubscriptionActive] = useState(false);

    useEffect(() => {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        const getPackages = async () => {
            if (Platform.OS === 'ios') {
                Purchases.configure({apiKey: "appl_NIMzKbuELZwYrRadlznGbomLWLN"});
            } else if (Platform.OS === 'android') {
                Purchases.configure({apiKey: "goog_vCtRNkrJEMHsuLzlXyAtVaRsWjq"});
            }
            try {
                const offerings = await Purchases.getOfferings();
                // offerings !== undefined ? console.log(offerings) : console.log("Offerings are undefined")
                if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                    // console.log("Available Packages: ")
                    // console.log(offerings.current.availablePackages)
                    setPackages(offerings.current.availablePackages);
                }
            } catch (e) {
                Alert.alert(Strings[settingsObj.language].headers.errorAlert, e.message)
            }
          };
      
          getPackages();
    }, []);

    const getUserDetails = async () => {
        setIsAnonymous(await Purchases.isAnonymous());
        setRevCatId(await Purchases.getAppUserID());
    
        const customerInfo = await Purchases.getCustomerInfo();
        if (typeof customerInfo.entitlements.active[Strings.util.entitlements.storage1] !== 'undefined') {
            let ent = {...entitlements};
            ent.storage1 = true;
            setEntitlements(ent);
            setSubscriptionActive(true);
        }
        // setSubscriptionActive(typeof customerInfo.entitlements.active[Strings.util.entitlements.storage1] !== 'undefined');
    };
    
    useEffect(() => {
        // Get user details when component first mounts
        getUserDetails();
    }, []);

    useEffect(() => {
        if (subscriptionActive && (isAnonymous || !user.uid)) {
            let obj = {...settingsObj}
            if (obj.login === Strings.util.logins[0]) {
                obj.login = Strings.util.logins[1]
            }
            setSettingsObj(obj);
            navigation.push(Strings.util.routes.login)
        }
    }, [subscriptionActive]);
    
    useEffect(() => {
        // Subscribe to purchaser updates
        Purchases.addCustomerInfoUpdateListener(getUserDetails);
        return () => {
          Purchases.removeCustomerInfoUpdateListener(getUserDetails);
        };
    });

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

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: settingsObj.darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        <StatusBar 
            barStyle={settingsObj.darkMode ? 'light-content' : 'dark-content'}
        />
        {Platform.OS === 'android' && <View style={{height: StatusBar.currentHeight}} />}
        <Text style={[textStyles.headerText, {color: settingsObj.darkMode ? Colors.darkTheme.text : Colors.lightTheme.text}]}>{Strings.English.headers.subs}</Text>
        <View>
            {packages.length > 0 && <FlatList 
                style={containers.settingsBtnList}
                data={packages}
                renderItem={({ item, index }) => <PackageItem 
                    purchasePackage={item} 
                    setIsPurchasing={setIsPurchasing} 
                    language={settingsObj.language || Strings.util.languages[0]}
                    toLogin={ () => {
                        navigation.push(Strings.util.routes.login)
                    }}
                    toHome={ () => {
                        navigation.push(Strings.util.routes.home)
                    }}
                    isLast={index === packages.length -1}
                    isAnonymous={isAnonymous}
                    // ListFooterComponent={() => {}}
                />}
                keyExtractor={(item) => item.identifier}
            />}
            {/* <Text>{revCatId}</Text>
            <Text>{subscriptionActive ? 'Active' : 'Not Active'}</Text>
            <Text>{isAnonymous ? 'Anonymous' : 'Identified'}</Text> */}
        </View>
        <ButtonBar buttons={[cancelBtn, restoreBtn]} />
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