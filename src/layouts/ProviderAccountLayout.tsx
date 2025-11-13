import type { SidebarMenu } from './AccountLayout';
import GenericAccountLayout from './GenericAccountLayout';

const ProviderSidebarMenu: SidebarMenu[] = [
  {
    name: 'Account Management',
    path: '/',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
  {
    name: 'Notification',
    path: '/notify',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
  {
    name: 'Payments',
    path: '/payments',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
  {
    name: 'Payouts',
    path: '/payouts',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
  {
    name: 'Balances',
    path: '/balances',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
];

export default function ProviderAccountLayout() {
  return (
    <GenericAccountLayout
      title="Provider Account"
      basePath="/account/provider-account"
      menuItems={ProviderSidebarMenu}
      secondaryAction={{
        text: 'Back to User Account',
        path: '/account',
      }}
    />
  );
}
