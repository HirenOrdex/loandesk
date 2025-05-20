export interface AddressData {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  suiteNo?: string;
}

export interface PersonData {
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  email: string;
  phone: string;
  workPhone?: string | null;
  email2?: string | null;
  webUrl?: string | null;
  suiteNo?: string | null;
  linkedinUrl?: string | null;
  addressId?: string | null;
  address?: AddressData | null;  // <- updated to reflect structure correctly
  profileImage?: string | null
}
