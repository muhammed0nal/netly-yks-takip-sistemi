import EmptyState from '@/components/ui/EmptyState';
import InfoCard from '@/components/ui/InfoCard';
import ScreenContainer from '@/components/ui/ScreenContainer';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'YKS Adayı';

  return (
    <ScreenContainer scroll withGradient={false}>
      <ScreenHeader
        greeting={`Merhaba, ${firstName} 👋`}
        subtitle="Bugün harika bir gün!"
      />
      <InfoCard title="Henüz veri yok">
        <EmptyState
          title="Çalışma verilerin burada görünecek"
          description="Deneme sonuçlarını ve çalışma sürelerini ekledikçe grafikler ve istatistikler burada listelenecek."
        />
      </InfoCard>
    </ScreenContainer>
  );
}
