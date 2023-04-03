import { useContext, useEffect, useState } from "react";
import { SafeAreaView, View, StatusBar, FlatList } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import ButtonBar from '../components/ButtonBar';
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import Notify from "../components/Notify";
import { UserContext } from "../constants/UserContext";
import PackageItem from "../components/PackageItem";

export default function PurchaseScreen ({ route, navigation }) {
    const { settings } = route.params;
    const [packages, setPackages] = useState(["placeholder"])
    const [isPurchsing, setIsPurchasing] = useState(false);

    useEffect(() => {
        // Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        // Purchases.configure({
        //     // apiKey: "appl_NIMzKbuELZwYrRadlznGbomLWLN",
        //     apiKey: "goog_vCtRNkrJEMHsuLzlXyAtVaRsWjq",
        // })
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        if (Platform.OS === 'ios') {
            Purchases.configure({apiKey: "appl_NIMzKbuELZwYrRadlznGbomLWLN"});
        } else if (Platform.OS === 'android') {
            Purchases.configure({apiKey: "goog_vCtRNkrJEMHsuLzlXyAtVaRsWjq"});
        }
        const getPackages = async () => {
            try {
              const offerings = await Purchases.getOfferings();
              if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                setPackages(offerings.current.availablePackages);
              }
            } catch (e) {
            //   Alert.alert('Error getting offers', e.message);
              Notify.showError('English', e.message)
            }
          };
      
          getPackages();
    }, [])

    let cancelBtn = {
        title: "Cancel",
        color: darkMode ? Colors.darkTheme.buttons.cancel : Colors.lightTheme.buttons.cancel,
        iconName: Icons.cancel,
        onPress: () => {
            navigation.pop()
        },
        darkMode: darkMode
    }

    return <SafeAreaView style={[containers.safeArea, {backgroundColor: settings.darkMode ? Colors.darkTheme.background : Colors.lightTheme.background}]}> 
        <StatusBar 
            barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
        />
        <View>
            {/* <Text>{packages}</Text> */}
            <FlatList 
                data={packages}
                renderItem={({ item }) => <PackageItem 
                    purchasePackage={item} 
                    setIsPurchasing={setIsPurchasing} 
                    language={settings.language || Strings.util.languages[0]}
                    toLogin={ () => {
                        navigation.push(Strings.util.routes.login, {settings: settings})
                    }}
                />}
            />
        </View>
        <ButtonBar buttons={[cancelBtn]} />
    </SafeAreaView>
}