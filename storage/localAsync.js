import AsyncStorage from '@react-native-async-storage/async-storage';

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
        // saving error
    }
}

const getIng = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKeys.allIng)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
}

const storeRec = async (recObj) => {
    try {
        const jsonValue = JSON.stringify(recObj)
        await AsyncStorage.setItem(storageKeys.allRec, jsonValue)
    } catch (e) {
        // saving error
    }
}

const getRec = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKeys.allRec)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
}

const storeSettings = async (settingsObj) => {
    try {
        const jsonValue = JSON.stringify(settingsObj)
        await AsyncStorage.setItem(storageKeys.settings, jsonValue)
    } catch (e) {
        // saving error
    }
}

const getSettings = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKeys.settings)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
}

export {storeIng, getIng, storeRec, getRec, storeSettings, getSettings}