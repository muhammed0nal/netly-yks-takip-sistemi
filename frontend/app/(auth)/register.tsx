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

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError(null);

    if (name.trim().length < 2) {
      setError('Ad soyad en az 2 karakter olmalıdır');
      return;
    }
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
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Kayıt oluşturulamadı');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreenLayout
      subtitle="Hesabını oluştur ve ilerlemeni takip et"
      footer={
        <LinkText
          text="Zaten hesabın var mı?"
          linkText="Giriş yap"
          onPress={() => router.push('/(auth)/login')}
        />
      }>
      <View style={{ gap: 16 }}>
        {error ? <ErrorMessage message={error} /> : null}
        <AppInput
          autoCapitalize="words"
          autoComplete="name"
          label="Ad Soyad"
          leftIcon="person-outline"
          placeholder="Ali Yılmaz"
          value={name}
          onChangeText={setName}
        />
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
          autoComplete="password-new"
          isPassword
          label="Şifre"
          leftIcon="lock-closed-outline"
          placeholder="En az 8 karakter"
          value={password}
          onChangeText={setPassword}
        />
        <AppButton loading={loading} title="Kayıt Ol" onPress={handleRegister} />
      </View>
    </AuthScreenLayout>
  );
}
