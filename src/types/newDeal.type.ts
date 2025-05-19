export interface IBorrowerCompanyRequest {
  companyName: string;
  legalEntity: string;
  businessPhone: string;
  website?: string;
  suite?: string;
  address: {
    address1?: string | null;
    address2?: string | null;
    city: string;
    state: string;
    zip?: string | null;
    country: string;
    longitude: string;
    latitude: string;
    fulladdress: string;
    suiteno?: string | null;
  }[];
}
