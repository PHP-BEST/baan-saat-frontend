import type { User } from '@/interfaces/User';

export const MOCK_USER: User = {
  _id: '',
  name: '',
  role: 'customer',
  telNumber: '',
  avatarUrl: '',
  email: '',
  address: '',
  providerProfile: {
    title: '',

    description: '',
    skills: [],
  },
  lastLoginAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};
