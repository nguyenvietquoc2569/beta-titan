import AuthGuard from './components/guards/AuthGuard';
import { ReactNode } from 'react';
// guards
// import AuthGuard from '../guards/AuthGuard';
// components
// import MainLayout from './main';
import DashboardLayout from './components/dashboard';
import { LedgerLogoOnlyLayout } from './LogoOnlyLayout';
import { LanguageProvider } from './components/multi-language/language-context';
import { LoadingBackDrop } from './components/loading-backdrop/loading-backdrop-context';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  variant?: 'main' | 'dashboard' | 'logoOnly';
};

export function LedgerLayout({ variant = 'dashboard', children }: Props) {
  if (variant === 'logoOnly') {
    return <LedgerLogoOnlyLayout> {children} </LedgerLogoOnlyLayout>;
  }

  // if (variant === 'main') {
  //   return <MainLayout>{children}</MainLayout>;
  // }

  return (
    <LoadingBackDrop>
      <AuthGuard>
        <LanguageProvider>
          <DashboardLayout> {children} </DashboardLayout>
        </LanguageProvider>
      </AuthGuard>
    </LoadingBackDrop>
  );
}
