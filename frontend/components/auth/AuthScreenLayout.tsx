import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import AppLogo from '@/components/ui/AppLogo';
import ScreenContainer from '@/components/ui/ScreenContainer';
import { spacing } from '@/constants/Theme';

type AuthScreenLayoutProps = {
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthScreenLayout({ subtitle, children, footer }: AuthScreenLayoutProps) {
  return (
    <ScreenContainer scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.header}>
          <AppLogo subtitle={subtitle} />
        </View>
        <View style={styles.form}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
    flex: 1,
  },
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});
