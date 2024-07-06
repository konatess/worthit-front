import { createContext } from "react";
import Strings from "./Strings";

export const SettingsContext = createContext({
    darkMode: false, 
    currency: Strings.util.currencies[0], 
    language: Strings.util.languages[0], 
    login: Strings.util.logins[0],
    decimalLength: 2
});