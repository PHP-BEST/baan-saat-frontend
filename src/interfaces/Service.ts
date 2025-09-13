export interface Service {
  _id: string;
  customerId: string;
  title: string;
  description: string;
  budget: number;
  coverPhotoUrl: string;
  telNumber: string;
  location: string;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}
