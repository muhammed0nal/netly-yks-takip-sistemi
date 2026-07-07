import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { radius, spacing, typography } from '@/constants/Theme';

type AppLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
};

const sizes = {
  sm: { box: 48, icon: 24, title: 22 },
  md: { box: 72, icon: 36, title: 28 },
  lg: { box: 96, icon: 48, title: 32 },
};

export default function AppLogo({ size = 'md', subtitle }: AppLogoProps) {
  const config = sizes[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          { width: config.box, height: config.box, borderRadius: radius.lg },
        ]}>
        <Ionicons name="school" size={config.icon} color={Colors.dark.textPrimary} />
      </View>
      <Text style={[styles.title, { fontSize: config.title }]}>Netly YKS</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    backgroundColor: Colors.dark.blue500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    color: Colors.dark.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});
