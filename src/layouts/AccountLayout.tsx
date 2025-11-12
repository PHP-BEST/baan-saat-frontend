import GenericAccountLayout from './GenericAccountLayout';

const UserSidebarMenu = [
  { name: 'Profile', path: '/', isDisabled: false },
  { name: 'Become a Provider', path: '/become-provider', isDisabled: false },
  { name: 'Account Setting', path: '/setting', isDisabled: true },
  { name: 'Privacy', path: '/privacy', isDisabled: true },
  { name: 'My Applies', path: '/apply', isDisabled: false },
  { name: 'My Offers', path: '/offer', isDisabled: false },
  { name: 'My Posts', path: '/post', isDisabled: false },
  { name: 'Provider Account', path: '/provider-account', isDisabled: false },
];

export default function AccountLayout() {
  return (
    <GenericAccountLayout
      title="Your Account"
      basePath="/account"
      menuItems={UserSidebarMenu}
    />
  );
}
