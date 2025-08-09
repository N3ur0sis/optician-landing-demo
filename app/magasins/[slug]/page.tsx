
import StoreClient from '../StoreClient';

export default function StorePage({ params }: any) {
  return <StoreClient slug={params.slug} />;
}
