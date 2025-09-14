import mongoose, { Schema, Document } from "mongoose";

export interface ICandidate extends Document {
    name: string;
    email: string;
}

const candidateSchema = new Schema<ICandidate>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ICandidate>("Candidate", candidateSchema);
