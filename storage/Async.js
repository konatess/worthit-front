import AsyncStorage from '@react-native-async-storage/async-storage';
import Notify from '../components/Notify';
import Strings from '../constants/Strings';

export default {
    getSettings: async (language) => {
        try {
            const settingsobj = await AsyncStorage.getItem(Strings.keys.settings);
            if (settingsobj) {
                return JSON.parse(settingsobj);
            }
            else {
                return {
                    darkmode: false,
                    language: 'English',
                    dateFormat: 'MM/DD',
                    notifications: {
                        freq: 1,
                        time: '8:00 pm'
                    },
                    unit: 1,
                    userUnits: {
                        s: [],
                        p: []
                    },
                };
            }
        }
        catch (error) {
            return Notify(language, error.message);
        }
    },
    saveSettings: async (settingsobj, language) => {
        try {
            await AsyncStorage.setItem(Strings.keys.settings, JSON.stringify(settingsobj))
        }
        catch (error) {
            return Notify(language, error.message);
        }
    },
    getAllProd: async (language) => {
        try {
            let keys = await AsyncStorage.getAllKeys();
            let allKeys = await AsyncStorage.multiGet(keys, (err, stores) => {
                err && Notify(language, err);
            });
            let filterProd = allKeys.filter((result, i, store) => {
                // get at each store's key/value so you can work with it
                let key = store[i][0];
                return key.startsWith(Strings.keys.prodPrefix)
            });
            let prodArr =  filterProd.map((result, i, store) => {
                let key = store[i][0];
                let value = JSON.parse(store[i][1]);
                return {key: key, obj: value}
            });
            return prodArr;
        }
        catch (error) {
            return Notify(language, error.message);
        }
    },
    deleteAllProd: async (keys, language) => {
        if (keys.length) {
            try {
                AsyncStorage.multiRemove(keys, (err) => {
                    err && Notify(language, err);
                });
            }
            catch (error) {
                return Notify(language, error.message);
            }
        }
    },
    createProd: async (prodObj, language) => {
        AsyncStorage.setItem(Strings.keys.prodPrefix + prodObj.title, JSON.stringify(prodObj), (err) => {
            err && Notify(language, err);
        });
    },
    readProd: async (prodKey, language) => {
        try {
            const product = await AsyncStorage.getItem(prodKey);
            if (product) {
                return JSON.parse(product);
            }
        }
        catch (error) {
            return Notify(language, error.message);
        }
    },
    updateProd: async (prodKey, prodobj, language) => {
        try {
            AsyncStorage.mergeItem(prodKey, JSON.stringify(prodobj), (err) => {
                err && Notify(language, err);
            })
        }
        catch (error) {
            return Notify(language, error.message);
        }
    },
    deleteProd: async (prodKey, language) => {
        try {
            AsyncStorage.removeItem(prodKey, (err) => {
                err && Notify(language, err);
            });
        }
        catch (error) {
            return Notify(language, error.message);
        }
    }
};