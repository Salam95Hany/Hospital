export interface Patient {
  id?: number;
  fileNumber?: string;
  fullName: string;
  gender: 'male' | 'female';
  birthDate: Date;
  phoneNumber: string;
  email?: string;
  address?: string;
  nationalId?: string;
  
  // Medical Information
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height?: number;
  weight?: number;
  allergies?: string[];
  chronicDiseases?: string[];
  
  // Insurance Information
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceExpiryDate?: Date;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PatientFormStep {
  title: string;
  isCompleted: boolean;
}