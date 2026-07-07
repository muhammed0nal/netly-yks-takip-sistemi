import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IconButton from '@/components/ui/IconButton';
import Colors from '@/constants/Colors';
import { spacing, typography } from '@/constants/Theme';

type ScreenHeaderProps = {
  greeting: string;
  subtitle?: string;
  rightAction?: ReactNode;
  onNotificationPress?: () => void;
};

export default function ScreenHeader({
  greeting,
  subtitle,
  rightAction,
  onNotificationPress,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>{greeting}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction ?? (
        <IconButton
          icon="notifications-outline"
          accessibilityLabel="Bildirimler"
          onPress={onNotificationPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  greeting: {
    ...typography.heading,
    color: Colors.dark.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: Colors.dark.textSecondary,
  },
});
