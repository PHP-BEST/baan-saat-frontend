import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useUser } from '@/context/UserContext';
import { createIntentClientSecret } from '@/api/payment';

const clientSecret = '';

const PaymentElement = () => {
  // Make sure to call `loadStripe` outside of a component’s render to avoid
  // recreating the `Stripe` object on every render.
  const { user } = useUser();
  const CONNECTED_ACCOUNT_ID = user?.connectId;

  const stripePromise = loadStripe(
    "pk_test_51SEVXBDq0RRgQFS2Dtho4kyz7fivUZQRTg4yri6p5n31e8NtRcpUqwJqLkSY5MOO0yP53XAdytrXvpkQXcKSO6gH00h72GstKA", 
    { stripeAccount: CONNECTED_ACCOUNT_ID, }
  );

  const options = {
    // pass the client secret from the previous step
    clientSecret: clientSecret,
    // Fully customizable with the Appearance API
    // appearance: {/*...*/},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentElement;