export interface Doctor {
  id?: number;
  fullName: string;
  specialization?: string;
  department?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  licenseNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
