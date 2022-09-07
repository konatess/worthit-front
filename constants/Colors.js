const darkNeutral = '#001B2E';
const mediumNeutral = '#294C60';
const brightCool = '#B4CFBC';
const brightWarm = '#FFAC70';
const lightWarm ='#FFF0D6';
const lightCool = '#ADB6C4';

export default {
    lightTheme: {
        background: '#fdfdfd',
        buttons:{
            settings: lightWarm,
            save: brightCool,
            create: brightCool,
            cancel: lightCool,
            delete: brightWarm,
            filter: mediumNeutral,
            duplicate: lightWarm,
            newIngredient: brightCool,
            addIngredient: brightCool,
        },
        inputBorder: mediumNeutral,
        text: darkNeutral,
    },
    darkTheme: {
        background: darkNeutral,
        text: lightWarm
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
        trackfalse: mediumNeutral, 
        tracktrue: darkNeutral,
        thumbfalse: lightWarm,
        thumbtrue: brightCool,
        ios_backgroundColor: "#3e3e3e"
    },
};
