import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
    sendId: Types.ObjectId;
    candidateId: Types.ObjectId;
    message: string;
    tags: Types.ObjectId[];
}

const messageSchema = new Schema<IMessage>(
    {
        candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
        sendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
