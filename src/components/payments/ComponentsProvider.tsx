import { loadConnectAndInitialize } from '@stripe/connect-js';
import { ConnectComponentsProvider } from '@stripe/react-connect-js';
import { getConnectClientSecret } from '@/api/payment';
import { useState } from 'react';

const ComponentsProvider = ({ children }: { children: React.ReactNode }) => {
  // We use `useState` to ensure the Connect instance is only initialized once
  const [stripeConnectInstance] = useState(() => {
    return loadConnectAndInitialize({
      // This is your test publishable API key.
      publishableKey:
        'pk_test_51SJVRvFaQigwOapPZIdy29BOTGvshns6JzXHbSFp4vAtRPHjJwRo98aCaONEmAbujA8FzDpZr8Vfr6oPdzSq56IW00glgjw7sA',
      fetchClientSecret: getConnectClientSecret,
      appearance: {
        variables: {
          colorBackground: '#FFFFFF',
        },
      },
    });
  });

  return (
    <>
      <div className="container">
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          {children}
        </ConnectComponentsProvider>
      </div>
    </>
  );
};

export default ComponentsProvider;
