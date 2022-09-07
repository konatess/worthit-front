import { Ionicons } from '@expo/vector-icons';

export default function ButtonIcon({name, size, color, style}) {
    return (
      <Ionicons
        name={name}
        size={size}
        style={style}
        color={color}
      />
    );
}