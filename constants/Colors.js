// const darkText = '#001B2E';
// const darkGray = '#294C60';
// const darkTeal = '#1AC7C7';
// const darkGreen = '#5F956E';
// const darkBrown = '#A78162';
// const darkOrange = '#F55600';
// const lightGray = '#ADB6C4';
// const lightGreen = '#B4CFBC';
// const lightBrown = '#FFAC70';
// const lightTurquoise = '#69F2F2'  // '#5DEAEA';
// const lightText ='#FFF0D6';  //f3f4f6


const darkGray = '#294C60';
const lightGray = '#ADB6C4';
const offWhite = '#FFFAEF';  
const offBlack = '#001B2E';
const darkBrown = '#A78162';
const lightBrown = '#FFDDA1';
const darkGreen = '#5F956E';
const lightGreen = '#B4CFBC';
const darkOrange = '#F55600';
const lightOrange = '#FFAC70';
const darkTurquoise = '#1AC7C7';
const lightTurquoise = '#69F2F2';

export default {
    lightTheme: {
        background: offWhite,
        buttons:{
            emptyBtnBorders: darkBrown,
            settings: lightBrown,
            save: lightGreen,
            create: lightGreen,
            cancel: lightGray,
            delete: lightOrange,
            filter: lightTurquoise,
            duplicate: lightBrown,
            newIngredient: lightGreen,
            addIngredient: lightGreen,
            info: darkTurquoise,
        },
        inputBorder: darkGray,
        text:  offBlack, // darkGray,
        placeholderText: darkGray,
        disabledText: darkGray,
        inputErrorText: darkOrange,
        modalShadow: offBlack,
    },
    darkTheme: {
        background: offBlack,
        buttons:{
            emptyBtnBorders: lightBrown,
            settings: darkBrown,
            save: darkGreen,
            create: darkGreen,
            cancel: darkGray,
            delete: darkOrange,
            filter: darkTurquoise,
            duplicate: darkBrown,
            newIngredient: darkGreen,
            addIngredient: darkGreen,
            info: lightTurquoise,
        },
        inputBorder: lightGray,
        text: offWhite,
        placeholderText: lightGray,
        disabledText: lightGray,
        inputErrorText: darkOrange,
        modalShadow: lightGray,
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
