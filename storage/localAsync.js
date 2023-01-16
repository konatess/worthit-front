import AsyncStorage from '@react-native-async-storage/async-storage';
import Notify from '../components/Notify';
import Strings from '../constants/Strings';


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
        Notify.showError(Strings.util.languages[0], e.message);
    }
}

const getIng = async (callback) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKeys.allIng);
        callback(jsonValue != null ? JSON.parse(jsonValue) : {});
    } catch(e) {
        Notify.showError(Strings.util.languages[0], e.message);
    }
}

const storeRec = async (recObj) => {
    console.log(recObj)
    try {
        const jsonValue = JSON.stringify(recObj);
        console.log(jsonValue)
        await AsyncStorage.setItem(storageKeys.allRec, jsonValue);
    } catch (e) {
        Notify.showError(Strings.util.languages[0], e.message);
    }
}

const getRec = async (callback) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKeys.allRec);
        callback(jsonValue != null ? JSON.parse(jsonValue) : {});
    } catch(e) {
        Notify.showError(Strings.util.languages[0], e.message);
    }
}

const storeSettings = async (settingsObj) => {
    try {
        const jsonValue = JSON.stringify(settingsObj);
        await AsyncStorage.setItem(storageKeys.settings, jsonValue);
    } catch (e) {
        Notify.showError(Strings.util.languages[0], e.message);
    }
}

const getSettings = async (callback) => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKeys.settings);
    callback(jsonValue != null ? JSON.parse(jsonValue) : {darkMode: false, currency: Strings.util.currencies[0], language: Strings.util.languages[0], login: Strings.util.logins[0]});
    } catch(e) {
        Notify.showError(Strings.util.languages[0], e.message);
    }
}

export {storeIng, getIng, storeRec, getRec, storeSettings, getSettings}