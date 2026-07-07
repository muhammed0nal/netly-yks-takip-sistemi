import { router } from 'expo-router';

import AppButton from '@/components/ui/AppButton';
import EmptyState from '@/components/ui/EmptyState';
import InfoCard from '@/components/ui/InfoCard';
import ScreenContainer from '@/components/ui/ScreenContainer';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  return (
    <ScreenContainer scroll withGradient={false}>
      <ScreenHeader greeting="Profil" subtitle={user?.email ?? ''} />
      <InfoCard title={user?.name ?? 'Kullanıcı'} subtitle="Hesap bilgilerin">
        <EmptyState
          icon="person-circle-outline"
          title="Profil ayarları yakında"
          description="Hesap düzenleme ve tercihler bu ekranda yer alacak."
          action={<AppButton title="Çıkış Yap" variant="secondary" onPress={handleLogout} />}
        />
      </InfoCard>
    </ScreenContainer>
  );
}
