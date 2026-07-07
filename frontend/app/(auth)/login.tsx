import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import AuthScreenLayout from '@/components/auth/AuthScreenLayout';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LinkText from '@/components/ui/LinkText';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);

    if (!email.trim()) {
      setError('E-posta zorunludur');
      return;
    }
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreenLayout
      subtitle="YKS hazırlık yolculuğuna hoş geldin"
      footer={
        <LinkText
          text="Hesabın yok mu?"
          linkText="Kayıt ol"
          onPress={() => router.push('/(auth)/register')}
        />
      }>
      <View style={{ gap: 16 }}>
        {error ? <ErrorMessage message={error} /> : null}
        <AppInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="E-posta"
          leftIcon="mail-outline"
          placeholder="ornek@email.com"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput
          autoCapitalize="none"
          autoComplete="password"
          isPassword
          label="Şifre"
          leftIcon="lock-closed-outline"
          placeholder="En az 8 karakter"
          value={password}
          onChangeText={setPassword}
        />
        <AppButton loading={loading} title="Giriş Yap" onPress={handleLogin} />
      </View>
    </AuthScreenLayout>
  );
}
