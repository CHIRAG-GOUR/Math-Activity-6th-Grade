import { DecimalDeliveryGame } from '@/game/decimal-delivery/ui/DecimalDeliveryGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Decimal Delivery Network | Grade 6 Decimals Depot Duel',
  description:
    'Two competing parcel depots race to process decimal delivery orders: weigh, sort, price and dispatch every shipment correctly to earn delivery priority.',
};

export default function DecimalDeliveryPage() {
  return <DecimalDeliveryGame />;
}
