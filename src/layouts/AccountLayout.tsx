import GenericAccountLayout from './GenericAccountLayout';

export interface SidebarMenu {
  name: string;
  path: string;
  isDisabled: boolean;
  roleToDisplay: 'customer' | 'provider' | 'both';
}

const UserSidebarMenu: SidebarMenu[] = [
  { name: 'Profile', path: '/', isDisabled: false, roleToDisplay: 'both' },
  {
    name: 'Become a Provider',
    path: '/become-provider',
    isDisabled: false,
    roleToDisplay: 'customer',
  },
  {
    name: 'Account Setting',
    path: '/setting',
    isDisabled: true,
    roleToDisplay: 'both',
  },
  {
    name: 'Privacy',
    path: '/privacy',
    isDisabled: true,
    roleToDisplay: 'both',
  },
  {
    name: 'My Applies',
    path: '/apply',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
  {
    name: 'My Offers',
    path: '/offer',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
  {
    name: 'My Posts',
    path: '/post',
    isDisabled: false,
    roleToDisplay: 'both',
  },
  {
    name: 'My Works',
    path: '/work',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
  {
    name: 'Provider Account',
    path: '/provider-account',
    isDisabled: false,
    roleToDisplay: 'provider',
  },
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
