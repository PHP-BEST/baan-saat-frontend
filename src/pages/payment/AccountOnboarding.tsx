import {
  AccountOnboarding,
  Payments,
  Payouts,
} from '@/components/payments/paymentComponents';

const AccountOnboardingUI = () => {
  return (
    <>
      <AccountOnboarding />
      <br></br>
      <br></br>
      <Payments />
      <br></br>
      <br></br>
      <Payouts />
    </>
  );
};

export default AccountOnboardingUI;
