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
        'pk_test_51SEVXBDq0RRgQFS2Dtho4kyz7fivUZQRTg4yri6p5n31e8NtRcpUqwJqLkSY5MOO0yP53XAdytrXvpkQXcKSO6gH00h72GstKA',
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
