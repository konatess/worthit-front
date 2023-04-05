import { useEffect, useState } from "react";
import { SafeAreaView, View, StatusBar, FlatList, Text } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import ButtonBar from '../components/ButtonBar';
import Icons from "../constants/Icons";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import Notify from "../components/Notify";
import PackageItem from "../components/PackageItem";
import { containers } from "../constants/Styles";

export default function PurchaseScreen ({ route, navigation }) {
    const { settings } = route.params;
    const [packages, setPackages] = useState([])
    const [isPurchsing, setIsPurchasing] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [userId, setUserId] = useState(null);
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
                Notify.showError(settings.language, e.message)
            }
          };
      
          getPackages();
    }, []);

    const getUserDetails = async () => {
        setIsAnonymous(await Purchases.isAnonymous());
        setUserId(await Purchases.getAppUserID());
    
        const customerInfo = await Purchases.getCustomerInfo();
        setSubscriptionActive(typeof customerInfo.entitlements.active[Strings.util.entitlements.storage1] !== 'undefined');
    };
    
    useEffect(() => {
        // Get user details when component first mounts
        getUserDetails();
    }, []);

    useEffect(() => {
        if (subscriptionActive && isAnonymous) {
            let obj = {...settings}
            if (obj.login === Strings.util.logins[0]) {
                obj.login = Strings.util.logins[1]
            }
            navigation.push(Strings.util.routes.login, {settings: obj})
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
        color: settings.darkMode ? Colors.darkTheme.buttons.cancel : Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.pop()
        },
        darkMode: settings.darkMode
    }

    let restoreBtn = {
        title: Strings.English.buttons.restoreP,
        color: settings.darkMode ? Colors.darkTheme.buttons.restoreP : Colors.lightTheme.buttons.restoreP,
        iconName: Icons.restore,
        onPress: async () => {
            try {
                await Purchases.restorePurchases();
            } catch (e) {
                Notify.showError(settings.language, e.message);
            }
        },
        darkMode: settings.darkMode
    }

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: settings.darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        <StatusBar 
            barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
        />
        {Platform.OS === 'android' && <View style={{height: StatusBar.currentHeight}} />}
        <View>
            {packages.length > 0 && <FlatList 
                style={containers.settingsBtnList}
                data={packages}
                renderItem={({ item, index }) => <PackageItem 
                    purchasePackage={item} 
                    setIsPurchasing={setIsPurchasing} 
                    language={settings.language || Strings.util.languages[0]}
                    toLogin={ () => {
                        navigation.push(Strings.util.routes.login, {settings: settings})
                    }}
                    toHome={ () => {
                        navigation.push(Strings.util.routes.home, {settings: settings})
                    }}
                    isLast={index === packages.length -1}
                    isAnonymous={isAnonymous}
                />}
                keyExtractor={(item) => item.identifier}
            />}
            <Text>{userId}</Text>
            <Text>{subscriptionActive ? 'Active' : 'Not Active'}</Text>
            <Text>{isAnonymous ? 'Anonymous' : 'Identified'}</Text>
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