import NavButton from "./NavButton";
import { View } from 'react-native';
import { containers } from "../constants/Styles";

export default function ButtonBar({buttons}) {
        return <View style={ containers.buttonBar } >
            {buttons.map((unit, index) => {
                return (
                    <NavButton 
                        key={index + unit.title}
                        title={unit.title} 
                        color={unit.color} 
                        iconName={unit.iconName} 
                        onPress={unit.onPress} 
                        disabled={unit.disabled || false}
                        darkMode={unit.darkMode}
                    />
                )
            })}
    </View>
}