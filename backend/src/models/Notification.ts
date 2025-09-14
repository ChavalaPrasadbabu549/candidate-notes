import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
    userId: Types.ObjectId;
    candidateId: Types.ObjectId;
    message: string;
    read: boolean;
}

const notificationSchema = new Schema<INotification>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<INotification>("Notification", notificationSchema);
