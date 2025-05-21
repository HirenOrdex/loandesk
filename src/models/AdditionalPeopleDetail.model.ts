import { optional } from "joi";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAdditionalPeopleDetail extends Document {
    dealDataReqId: Types.ObjectId;
    guarantorIds: Types.ObjectId[];
    borrowerCompanyId: Types.ObjectId;
    personId: Types.ObjectId;
    active: boolean;
    createdBy: string;
    updatedBy: string;
    suiteNo: string;
}

const AdditionalPeopleDetailSchema: Schema = new Schema(
    {
        dealDataReqId: { type: Schema.Types.ObjectId, ref: "DealDataRequest", required: false },
        guarantorIds: [{ type: Schema.Types.ObjectId, ref: "Guarantor", required: false }],
        borrowerCompanyId: { type: Schema.Types.ObjectId, ref: "BorrowerCompany", required: false },
        personId: { type: Schema.Types.ObjectId, ref: "Person", required: false },
        active: { type: Boolean, default: false },
        createdBy: { type: String, required: false },
        updatedBy: { type: String, required: false },
        suiteNo: { type: String, optional: false }
    },
    {
        collection: "additionalPeopleDetails",
        timestamps: false
    }
);

export const AdditionalPeopleDetailModel = mongoose.model<IAdditionalPeopleDetail>(
    "AdditionalPeopleDetail",
    AdditionalPeopleDetailSchema
);