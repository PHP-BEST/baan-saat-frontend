import GenericAccountLayout from './GenericAccountLayout';

const ProviderSidebarMenu = [
  { name: 'Notification', path: '/', isDisabled: false },
  { name: 'Account Management', path: '/manage', isDisabled: false },
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
