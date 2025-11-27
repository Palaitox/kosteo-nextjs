import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    sku: string;
    unit_cost: number;
    pvp: number; // precio venta
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        sku: { type: String, required: true, unique: true, trim: true },
        unit_cost: { type: Number, required: true, min: 0 },
        pvp: { type: Number, required: true, min: 0 },
        stock: { type: Number, default: 0, min: 0 },
    },
    {
        timestamps: true
    }
);

// Transform JSON to expose "id" instead of "_id"
ProductSchema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
    },
});

// Prevent model recompilation in development
export const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
