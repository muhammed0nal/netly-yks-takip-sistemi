import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { spacing } from '@/constants/Theme';

type ScreenContainerProps = ViewProps & {
  children: ReactNode;
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
  withGradient?: boolean;
  padded?: boolean;
};

export default function ScreenContainer({
  children,
  scroll = false,
  scrollProps,
  withGradient = true,
  padded = true,
  style,
  ...viewProps
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const contentStyle = [
    styles.content,
    padded && styles.padded,
    { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
    style,
  ];

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[contentStyle, styles.scrollContent]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollProps}>
      {children}
    </ScrollView>
  ) : (
    <View style={contentStyle} {...viewProps}>
      {children}
    </View>
  );

  if (!withGradient) {
    return (
      <View style={styles.root}>
        {body}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.dark.navy900, Colors.dark.navy800, Colors.dark.navy900]}
      style={styles.root}>
      {body}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.navy900,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});
