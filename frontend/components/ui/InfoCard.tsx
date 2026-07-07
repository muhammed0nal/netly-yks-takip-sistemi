import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

import Colors from '@/constants/Colors';
import { radius, spacing, typography } from '@/constants/Theme';

type InfoCardProps = ViewProps & {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
};

export default function InfoCard({
  title,
  subtitle,
  action,
  children,
  style,
  ...viewProps
}: InfoCardProps) {
  return (
    <View style={[styles.card, style]} {...viewProps}>
      {(title || action) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {action}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.navy700,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.bodyBold,
    color: Colors.dark.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: Colors.dark.textSecondary,
  },
});
