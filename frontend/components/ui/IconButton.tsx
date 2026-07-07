import { Ionicons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';

import Colors from '@/constants/Colors';
import { radius } from '@/constants/Theme';

type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

export default function IconButton({
  icon,
  size = 22,
  color = Colors.dark.textPrimary,
  style,
  ...pressableProps
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      {...pressableProps}>
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: Colors.dark.navy700,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
