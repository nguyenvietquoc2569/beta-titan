import { ReactNode } from 'react';
// next
import { useRouter } from 'next/router';
import { LoadingScreen } from '@beta-titan/ledger/frontend/utilities/core-components'
import { useSession } from '@beta-titan/ledger/frontend/utilities/shared';

// hooks
// components

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { session, isLoading } = useSession()

  const { asPath , push } = useRouter();

  // const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  // useEffect(() => {
  //   if (requestedLocation && pathname !== requestedLocation) {
  //     push(requestedLocation);
  //   }
  //   if (isAuthenticated) {
  //     setRequestedLocation(null);
  //   }
  // }, [isAuthenticated, pathname, push, requestedLocation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session) {
    push(`/auth/login?RETURNURL=${encodeURI(asPath)}`)
    return <LoadingScreen />
  }

  // if (!isAuthenticated) {
  //   if (pathname !== requestedLocation) {
  //     setRequestedLocation(pathname);
  //   }
  //   return <Login />;
  // }

  return <> {children} </>;
}
