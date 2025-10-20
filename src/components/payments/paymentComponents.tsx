import { promoteUser } from '@/api/user';
import ComponentsProvider from './ComponentsProvider';
import {
  ConnectAccountOnboarding,
  ConnectAccountManagement,
  ConnectNotificationBanner,
  ConnectPayments,
  ConnectPayouts,
  ConnectBalances,
} from '@stripe/react-connect-js';

export const AccountOnboarding = () => {
  return (
    <ComponentsProvider>
      <ConnectAccountOnboarding
        onExit={async () => {
          console.log('The account has exited onboarding');
          await promoteUser();
          window.location.href = '/account';
        }}
      />
    </ComponentsProvider>
  );
};

export const AccountManagement = () => {
  return (
    <ComponentsProvider>
      <ConnectAccountManagement />
    </ComponentsProvider>
  );
};

export const NotificationBanner = () => {
  return (
    <ComponentsProvider>
      <ConnectNotificationBanner />
    </ComponentsProvider>
  );
};

export const Payments = () => {
  return (
    <ComponentsProvider>
      <ConnectPayments />
    </ComponentsProvider>
  );
};

export const Payouts = () => {
  return (
    <ComponentsProvider>
      <ConnectPayouts />
    </ComponentsProvider>
  );
};

export const Balances = () => {
  return (
    <ComponentsProvider>
      <ConnectBalances />
    </ComponentsProvider>
  );
};
