import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { getPaymentIntentSecret } from '@/api/payment';
import { useState } from 'react';
import { VITE_STRIPE_PUBLISHABLE_KEY } from '@/config/env';

type PaymentIntentType = {
  postId: string;
  providerConnectId: string;
};

const PaymentIntent = ({ postId, providerConnectId }: PaymentIntentType) => {
  // Make sure to call `loadStripe` outside of a component’s render to avoid
  // recreating the `Stripe` object on every render.
  const [clientSecret, setClientSecret] = useState<string>('');

  const stripePromise = loadStripe(VITE_STRIPE_PUBLISHABLE_KEY, {
    stripeAccount: providerConnectId,
  });

  (async () => {
    try {
      const secret = await getPaymentIntentSecret(postId);
      setClientSecret(secret);
    } catch (error) {
      console.error('Error fetching payment intent:', error);
    }
  })();

  const options = {
    // pass the client secret from the previous step
    clientSecret: clientSecret,
    // Fully customizable with the Appearance API
    appearance: {
      /*...*/
    },
  };

  // Don't render Elements until we have the clientSecret
  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentIntent;
