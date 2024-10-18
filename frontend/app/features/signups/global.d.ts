interface SignUpRequest {
  id: ID;
  createdAt: string;
  declineReason?: string;
  email: string;
  firstName: string;
  lastName: string;
  linkedin?: string;
  organizationAddress: string;
  organizationBusiness?: string;
  organizationCountry: string;
  organizationName: string;
  organizationPostcode: number | string;
  otherLink?: string;
  phoneNumber: string;
  position?: string;
  researchGate?: string;
  role?: string;
  status: string;
  title: string;
  updatedAt: string;
  website?: string;
}
