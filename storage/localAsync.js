import AsyncStorage from '@react-native-async-storage/async-storage';
import { showError } from '../components/Notify';


const storageKeys = {
    allIng: 'ALLINGREDIENTS',
    allRec: 'ALLRECIPES',
    settings: 'SETTINGS',
}

const storeIng = async (ingObj) => {
    try {
        const jsonValue = JSON.stringify(ingObj)
        await AsyncStorage.setItem(storageKeys.allIng, jsonValue)
    } catch (e) {
        showError(Strings.util.languages[0], e.message);
    }
}

const getIng = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKeys.allIng)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        showError(Strings.util.languages[0], e.message);
    }
}

const storeRec = async (recObj) => {
    try {
        const jsonValue = JSON.stringify(recObj)
        await AsyncStorage.setItem(storageKeys.allRec, jsonValue)
    } catch (e) {
        showError(Strings.util.languages[0], e.message);
    }
}

const getRec = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKeys.allRec)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        showError(Strings.util.languages[0], e.message);
    }
}

const storeSettings = async (settingsObj) => {
    try {
        const jsonValue = JSON.stringify(settingsObj)
        await AsyncStorage.setItem(storageKeys.settings, jsonValue)
    } catch (e) {
        showError(Strings.util.languages[0], e.message);
    }
}

const getSettings = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKeys.settings)
      return jsonValue != null ? JSON.parse(jsonValue) : {darkMode: false, currency: Strings.util.currencies[0], language: Strings.util.languages[0], };
    } catch(e) {
        showError(Strings.util.languages[0], e.message);
    }
}

export {storeIng, getIng, storeRec, getRec, storeSettings, getSettings}