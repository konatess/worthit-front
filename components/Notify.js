import {
	ToastAndroid,
	Platform,
	Alert,
} from 'react-native';
import Strings from '../constants/Strings';

const showError = (language, msg) => {
	if (Platform.OS === 'android') {
		ToastAndroid.show(Strings[language].alerts.error + msg, ToastAndroid.SHORT)
	} else {
		Alert.alert(Strings[language].alerts.error + msg);
	}
}

export default { showError }