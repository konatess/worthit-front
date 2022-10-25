import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserContext } from './constants/UserContext';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import RecipeScreen from './screens/RecipeScreen';
import LoginScreen from './screens/LoginScreen';
import Notify from './components/Notify';
import Strings from './constants/Strings';



const Stack = createNativeStackNavigator();

export default function App() {
	const [isLoadingComplete, setLoadingComplete] = useState(false);
	const [user, setUser] = useState({uid: ""});
	const [settingsObj, setSettingsObj] = useState({
		darkmode: false,
		language: 'English',
		dateFormat: 'MM/DD',
	});
	


	// Load any resources or data that we need prior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
		try {
			SplashScreen.preventAutoHideAsync();
		} catch (e) {
			// We might want to provide this error information to an error reporting service
			Notify('English', e.message);
		} finally {
			setLoadingComplete(true);
			SplashScreen.hideAsync();
		}
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
					<Stack.Navigator initialRouteName={user.uid ? Strings.util.routes.home : Strings.util.routes.login}  screenOptions={{headerShown:false}} >
					{user.uid ? 
					<>
						<Stack.Screen name={Strings.util.routes.home} component={HomeScreen} initialParams={{settings: settingsObj}}/>
						<Stack.Screen name={Strings.util.routes.settings} component={SettingsScreen} initialParams={{settings: settingsObj}}/>
						<Stack.Screen name={Strings.util.routes.recipe} component={RecipeScreen} />
					</> 
					: 
					<>
						<Stack.Screen name="Login" component={LoginScreen} 
							// initialParams={{routeAuth: JSON.stringify(auth)}}
						/>
						{/* <Stack.Screen name="Signup" component={SignUpScreen}/> */}
					</>}
					</Stack.Navigator>
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
