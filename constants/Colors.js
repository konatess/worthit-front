const darkText = '#001B2E';
const darkCool = '#294C60';
const darkGreen = '#5F956E';
const darkBrown = '#A78162';
const darkOrange = '#F55600';
const lightGrey = '#ADB6C4';
const lightGreen = '#B4CFBC';
const lightBrown = '#FFAC70';
const lightTurquoise = '#1CD9D9'
const lightText ='#FFF0D6';

export default {
    lightTheme: {
        background: '#fdfdfd',
        buttons:{
            settings: lightText,
            save: lightGreen,
            create: lightGreen,
            cancel: lightGrey,
            delete: lightBrown,
            filter: lightTurquoise,
            duplicate: lightText,
            newIngredient: lightGreen,
            addIngredient: lightGreen,
        },
        inputBorder: darkCool,
        text: darkText,
        disabledText: lightGrey,
        inputErrorText: darkOrange,
    },
    darkTheme: {
        background: darkText,
        text: lightText
    },
    tabIconDefault: '#fff',
    errorBackground: 'red',
    errorText: '#fff',
    warningBackground: '#EAEB5E',
    warningText: '#666804',
    noticeText: '#fff',
    navButtonText: '#eee',
    navButtonIcon: '#eee',
    mainbackground: '#fcfcfc',
    maintext: '#111',
    modalbackground: '#eee',
    settingsIcons: '#888',
    transparent: '#0000',
    toggle: {
        trackfalse: darkCool, 
        tracktrue: darkText,
        thumbfalse: lightText,
        thumbtrue: lightTurquoise,
        ios_backgroundColor: "#3e3e3e"
    },
};
