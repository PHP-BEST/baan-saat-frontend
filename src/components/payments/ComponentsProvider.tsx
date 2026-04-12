import { loadConnectAndInitialize } from '@stripe/connect-js';
import { ConnectComponentsProvider } from '@stripe/react-connect-js';
import { getConnectClientSecret } from '@/api/payment';
import { useState } from 'react';
import { VITE_STRIPE_PUBLISHABLE_KEY } from '@/config/env';

const ComponentsProvider = ({ children }: { children: React.ReactNode }) => {
  // We use `useState` to ensure the Connect instance is only initialized once
  const [stripeConnectInstance] = useState(() => {
    return loadConnectAndInitialize({
      // This is your test publishable API key.
      publishableKey: VITE_STRIPE_PUBLISHABLE_KEY,
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
