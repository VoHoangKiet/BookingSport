import { Suspense } from 'react';
import { LoadingScreen } from '@/components/ui';

export function LazyWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
