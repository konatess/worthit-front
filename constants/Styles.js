
import { Dimensions, StyleSheet } from 'react-native';
import Colors from "../constants/Colors";

const width = Dimensions.get('window').width

const sizer = width <= 400 ? 1 : ( width > 700 ? 1.6 : width/400 );

const containers = StyleSheet.create({
    // safe area view
    safeArea: {
		flex: 1,
        paddingVertical: 5
    },
    logins: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Project screens view, inside safe area view
    projArea: {
        flex: 1,
        padding: 10,
        marginBottom: 50 * sizer,
    }, 
    screenMsgArea: {
        flex: 1,
        padding: 20 * sizer,
        marginBottom: 50 * sizer,
    }, 
    topPadding: {
        height: 10 * sizer
    },
    settingsBtnList: {
        padding:10
    },
    buttonBar: {
        flexDirection: 'row',
        height: 70 * sizer,
        width: width,
        padding: 0,
        position: 'absolute',
        bottom: 0
    },
    centerModal: {
        flex: 1,
        flexShrink: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalArea: {
        margin: 30 * sizer,
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    pickerArea: {
        maxHeight: 150 * sizer,
        marginVertical: 10,
        borderWidth: .5,
        borderRadius: 10,
        padding: 5,
    },
    loginInputs: {
        width: 200 * sizer,
    },
    tableArea: {
        width: 250 * sizer,
        borderWidth: 1,
        borderRadius: 10,
        maxHeight: 300 * sizer,
        margin: 10,
        paddingHorizontal: 10
    }
});

const rows = StyleSheet.create({
    row1: {
        flexDirection: 'row', 
        marginBottom: 10,
        alignItems: 'center',
    },
    rowModal: {
        flexDirection: 'row', 
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    vertical: {
        justifyContent: 'flex-start',
    },
    rowModalTable: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignContent: 'stretch',
        width: 230 * sizer,
        padding: 5,
        borderBottomWidth: 1,
    },
});

const buttonStyles = StyleSheet.create({
    basicButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 0
    },
    loginButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
    },
    loginWithEmail: {
        marginTop: 10,
    },
    modalButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 5,
        marginHorizontal: 5,
    },
    pickerButton: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginBottom: 3,
        borderRadius: 10,
        borderWidth: .5,
    },
    navBtn: {
        flex:1, 
        padding: 15,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ingBtn: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        justifyContent: 'flex-start', 
        alignItems: 'stretch',
        borderWidth: .5,
    },
    prodBtn: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        justifyContent: 'flex-start', 
        alignItems: 'stretch',
        borderWidth: .5,
    },
    settingsBtnArea: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
    },
    settingsIconArea: {
        marginRight: 12,
    },
    settingslastBtn: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    purchaseBtnArea: {
        // flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
    },
    fab: {
        position: 'absolute',
        right: 15,
        bottom: 75 * sizer,
        backgroundColor: Colors.transparent,
        borderRadius: 50,
    },
    recipeManageIngBtn: {
        marginVertical: 5,
        marginHorizontal: 10
    },
    infoBtn: {
        marginLeft: 10
    },
    infoBtnLarge: {
        position: 'absolute',
        bottom: 100,
        right: 20,
    },
    bEABtn: {
        padding: 10,
        marginBottom: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: .2,
    }
});

const inputStyles = StyleSheet.create({
    inputField: {
        borderWidth: 1, 
        padding: 3,
        paddingHorizontal: 10,
        fontSize: 18 * sizer,
        maxWidth: '75%'
    }, 
    loginField: {
        marginTop: 10,
        borderWidth: 1, 
        padding: 3,
        paddingHorizontal: 10,
        fontSize: 18 * sizer,
    },
    longInputs: {
        maxWidth: '100%'
    }
});

const textStyles = StyleSheet.create({
    labelText: {
        fontSize: 20 * sizer,
        paddingRight: 5,
        marginTop: 5,
        marginBottom: 2,
        textAlignVertical: 'center',
        flexShrink: 1,
    }, 
    headerText: {
        fontSize: 25 * sizer,
        marginTop: 5,
        textAlign: 'center',
    },
    buttonText: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14 * sizer,
    },
    modalMsgText: {
        marginBottom: 5,
        textAlign: "center",
        fontSize: 18 * sizer,
    },
    modalBtnText: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18 * sizer,
    },
    pickerText: {
        fontSize: 16 * sizer,
        alignSelf: 'flex-start',
        marginTop: 1,
    },
    productTitleText: {
        fontSize: 21 * sizer,
    },
    productPriceText: {
        fontSize: 19 * sizer,
    },
    productDescText: {
        fontSize: 16 * sizer,
    },
    settingsBtnText: {
        fontSize: 16 * sizer,
    },
    hintText: {
        fontSize: 14 * sizer,
    },
    tableItem: {
        fontSize: 16 * sizer,
        textAlign: 'center',
        width: 50 * sizer
    },
    tableCol1: {
        width: 130 * sizer
    },
    recipeManageIngBtn: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500'
    }
});

const iconSizes = StyleSheet.create({
    navIconSize: 30 * sizer,
    settingsIconSize: 22 * sizer,
    fabIconSize: 50 * sizer,
    modalIconSize: 18 * sizer,
    loginIconSize: 50 * sizer,
    infoIconSize: 24 * sizer,
    infoLargeIconSize: 50 * sizer
});

export {containers, rows, buttonStyles, inputStyles, textStyles, iconSizes};