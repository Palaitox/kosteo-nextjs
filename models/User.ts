import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: true }
    }
);

// Transform JSON to expose "id" instead of "_id"
UserSchema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
    },
});

// Prevent model recompilation in development
export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
