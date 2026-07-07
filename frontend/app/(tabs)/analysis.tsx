import EmptyState from '@/components/ui/EmptyState';
import InfoCard from '@/components/ui/InfoCard';
import ScreenContainer from '@/components/ui/ScreenContainer';
import ScreenHeader from '@/components/ui/ScreenHeader';

export default function AnalysisScreen() {
  return (
    <ScreenContainer scroll withGradient={false}>
      <ScreenHeader greeting="Analiz" subtitle="İlerleme grafiklerin" />
      <InfoCard title="Haftalık Çalışma Grafiği">
        <EmptyState
          icon="analytics-outline"
          title="Grafik için yeterli veri yok"
          description="Birkaç çalışma kaydı ekledikten sonra haftalık grafikler burada görünecek."
        />
      </InfoCard>
    </ScreenContainer>
  );
}
