import { Document, Types } from "mongoose";

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
  profileImage: string |null;
}