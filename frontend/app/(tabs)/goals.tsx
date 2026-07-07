import EmptyState from '@/components/ui/EmptyState';
import InfoCard from '@/components/ui/InfoCard';
import ScreenContainer from '@/components/ui/ScreenContainer';
import ScreenHeader from '@/components/ui/ScreenHeader';

export default function GoalsScreen() {
  return (
    <ScreenContainer scroll withGradient={false}>
      <ScreenHeader greeting="Hedefler" subtitle="YKS hedeflerini belirle" />
      <InfoCard>
        <EmptyState
          icon="flag-outline"
          title="Henüz hedef tanımlanmadı"
          description="Net hedeflerin ve günlük çalışma planların burada yer alacak."
        />
      </InfoCard>
    </ScreenContainer>
  );
}
