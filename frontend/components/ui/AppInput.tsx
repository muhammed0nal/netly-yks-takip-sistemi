import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { radius, spacing, typography } from '@/constants/Theme';

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
};

export default function AppInput({
  label,
  error,
  leftIcon,
  isPassword = false,
  style,
  ...inputProps
}: AppInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={20}
            color={Colors.dark.textMuted}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          placeholderTextColor={Colors.dark.textMuted}
          secureTextEntry={isPassword && !visible}
          style={[styles.input, style]}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
            hitSlop={8}
            onPress={() => setVisible((current) => !current)}>
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.dark.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: Colors.dark.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.navy700,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  inputRowError: {
    borderColor: Colors.dark.error,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: Colors.dark.textPrimary,
    paddingVertical: spacing.sm,
  },
  error: {
    ...typography.caption,
    color: Colors.dark.error,
  },
});
