import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

const getIng = async (callback) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKeys.allIng);
        callback(jsonValue != null ? JSON.parse(jsonValue) : {});
    } catch(e) {
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

const deleteIng = async () => {
    try{
        await AsyncStorage.removeItem(storageKeys.allIng);
    } catch(e) {
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

const storeRec = async (recObj) => {
    try {
        const jsonValue = JSON.stringify(recObj);
        await AsyncStorage.setItem(storageKeys.allRec, jsonValue);
    } catch (e) {
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

const getRec = async (callback) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKeys.allRec);
        callback(jsonValue != null ? JSON.parse(jsonValue) : {});
    } catch(e) {
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

const deleteRec = async () => {
    try{
        await AsyncStorage.removeItem(storageKeys.allRec);
    } catch(e) {
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

const storeSettings = async (settingsObj) => {
    try {
        const jsonValue = JSON.stringify(settingsObj);
        await AsyncStorage.setItem(storageKeys.settings, jsonValue);
    } catch (e) {
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

const getSettings = async (callback) => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKeys.settings);
    callback(jsonValue != null ? JSON.parse(jsonValue) : {darkMode: false, currency: Strings.util.currencies[0], language: Strings.util.languages[0], login: Strings.util.logins[0]});
    } catch(e) {
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

const getIngAndRec = async () => {
    try {
        const ingJson = await AsyncStorage.getItem(storageKeys.allIng);
        const recJson = await AsyncStorage.getItem(storageKeys.allRec);
        let ing = ingJson != null ? JSON.parse(ingJson) : {}
        let rec = recJson != null ? JSON.parse(recJson) : {}
        return {ingredients: ing, recipes: rec}
    } catch(e) {
        Alert.alert(Strings[Strings.util.languages[0]].headers.errorAlert, e.message);
    }
}

export {storeIng, getIng, deleteIng, storeRec, getRec, deleteRec, storeSettings, getSettings, getIngAndRec}