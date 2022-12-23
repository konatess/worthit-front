// const darkText = '#001B2E';
// const darkGray = '#294C60';
// const darkTeal = '#1AC7C7';
// const darkGreen = '#5F956E';
// const darkBrown = '#A78162';
// const darkOrange = '#F55600';
// const lightGrey = '#ADB6C4';
// const lightGreen = '#B4CFBC';
// const lightBrown = '#FFAC70';
// const lightTurquoise = '#69F2F2'  // '#5DEAEA';
// const lightText ='#FFF0D6';  //f3f4f6


const darkGray = '#294C60';
const lightGrey = '#ADB6C4';
const offWhite ='#FFFAEF';  
const offBlack = '#001B2E';
const darkGreen = '#5F956E';
const lightGreen = '#B4CFBC';
const darkOrange = '#F55600';
const lightOrange = '#FFAC70';
const darkTurquoise = '#1AC7C7';
const lightTurquoise = '#69F2F2'
const darkBrown = '#A78162';
const lightBrown = '#FFDDA1';

export default {
    lightTheme: {
        background: offWhite,
        buttons:{
            settings: lightBrown,
            save: lightGreen,
            create: lightGreen,
            cancel: lightGrey,
            delete: lightOrange,
            filter: lightTurquoise,
            duplicate: lightBrown,
            newIngredient: lightGreen,
            addIngredient: lightGreen,
            navButtonText: offWhite,
            navButtonIcon: offWhite,
        },
        inputBorder: darkGray,
        text:  offBlack, // darkGray,
        disabledText: darkGray,
        inputErrorText: darkOrange,
    },
    darkTheme: {
        background: offBlack,
        text: offWhite
    },
    transparent: '#0000',
    // toggle: {
    //     trackfalse: darkGray, 
    //     tracktrue: offBlack,
    //     thumbfalse: lightGray,
    //     thumbtrue: lightTurquoise,
    //     ios_backgroundColor: "#3e3e3e"
    // },
};
