import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Purchases, { LOG_LEVEL } from "react-native-purchases";

import { UserContext } from './constants/UserContext';
import { Entitlements } from './constants/EntitlementsContext';
import { SettingsContext } from './constants/SettingsContext';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import RecipeScreen from './screens/RecipeScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import LoginScreen from './screens/LoginScreen';
import Strings from './constants/Strings';
import { getSettings } from './storage/localAsync';



const Stack = createNativeStackNavigator();

export default function App() {
	const [isLoadingComplete, setLoadingComplete] = useState(false);
	const [user, setUser] = useState({uid: ""});
	const [settingsObj, setSettingsObj] = useState({});
	const [entitlements, setEntitlements] = useState({ storage1: false });
    const [isAnonymous, setIsAnonymous] = useState(true); // TODO: set up isAnonymous as context and update logout at signin screen
	


	// Load any resources or data that we need prior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync();
				await getSettings(setSettingsObj);
				setIsAnonymous(await Purchases.isAnonymous());
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message)
			} finally {
				setLoadingComplete(true);
				SplashScreen.hideAsync();
			}
		}

		Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
		if (Platform.OS === 'ios') {
			Purchases.configure({apiKey: "appl_NIMzKbuELZwYrRadlznGbomLWLN"});
		} else if (Platform.OS === 'android') {
			Purchases.configure({apiKey: "goog_vCtRNkrJEMHsuLzlXyAtVaRsWjq"});
		}

		loadResourcesAndDataAsync();
	}, []);

	if (!isLoadingComplete) {
		return null
	}
	else {
		return (
			<NavigationContainer>
				<StatusBar style="auto" />
				<UserContext.Provider value={{user, setUser}}>
				<Entitlements.Provider value={{entitlements, setEntitlements}}>
				<SettingsContext.Provider value={{settingsObj, setSettingsObj}}>
					<Stack.Navigator initialRouteName={ (settingsObj.login === Strings.util.logins[0]) || user.uid ? Strings.util.routes.home : Strings.util.routes.login}  screenOptions={{headerShown:false}} >
					{(settingsObj.login === Strings.util.logins[0]) || user.uid ? 
					<>
						<Stack.Screen name={Strings.util.routes.home} component={HomeScreen} />
						<Stack.Screen name={Strings.util.routes.settings} component={SettingsScreen} />
						<Stack.Screen name={Strings.util.routes.recipe} component={RecipeScreen} />
						<Stack.Screen name={Strings.util.routes.purchase} component={PurchaseScreen} />
					</> 
					: 
					<>
						<Stack.Screen name="Login" component={LoginScreen} />
						{/* <Stack.Screen name="Signup" component={SignUpScreen}/> */}
					</>}
					</Stack.Navigator>
				</SettingsContext.Provider>
				</Entitlements.Provider>
				</UserContext.Provider>
			</NavigationContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
