import GenericAccountLayout from './GenericAccountLayout';

const ProviderSidebarMenu = [
  { name: 'Account Management', path: '/', isDisabled: false },
  { name: 'Notification', path: '/notify', isDisabled: false },
  { name: 'Payments', path: '/payments', isDisabled: false },
  { name: 'Payouts', path: '/payouts', isDisabled: false },
  { name: 'Balances', path: '/balances', isDisabled: false },
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
