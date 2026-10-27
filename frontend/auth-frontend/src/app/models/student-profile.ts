export type DiplomaType =
  | 'BTS'
  | 'DUT'
  | 'DEUG'
  | 'DUST'
  | 'OFPPT'
  | 'OTHER';

export interface StudentProfile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  address: string;
  diplomaType: DiplomaType | '';
  diplomaName: string;
  institution: string;
  graduationYear: number | null;
  firstYearGrade: number | null;
  secondYearGrade: number | null;
  createdAt?: string;
  updatedAt?: string;
}
