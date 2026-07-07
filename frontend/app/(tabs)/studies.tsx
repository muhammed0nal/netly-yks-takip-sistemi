import EmptyState from '@/components/ui/EmptyState';
import InfoCard from '@/components/ui/InfoCard';
import ScreenContainer from '@/components/ui/ScreenContainer';
import ScreenHeader from '@/components/ui/ScreenHeader';

export default function StudiesScreen() {
  return (
    <ScreenContainer scroll withGradient={false}>
      <ScreenHeader greeting="Çalışmalar" subtitle="Konu ve soru takibin" />
      <InfoCard>
        <EmptyState
          icon="book-outline"
          title="Henüz çalışma kaydı yok"
          description="Çalışma oturumlarını ekledikçe burada listelenecek."
        />
      </InfoCard>
    </ScreenContainer>
  );
}
