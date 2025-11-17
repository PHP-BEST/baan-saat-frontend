interface ProviderProfile {
  description: string;
}

export interface User {
  _id: string;
  role: 'customer' | 'provider';
  name: string;
  email: string;
  avatarUrl: string;
  telNumber: string;
  address: string;
  lastLoginAt: Date;
  providerProfile?: ProviderProfile;
  connectId: string;
  createdAt: Date;
  updatedAt: Date;
}
