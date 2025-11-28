import mongoose, { Schema, Document } from 'mongoose';

export interface ICompra extends Document {
    supplier: string;
    product_name: string;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    date: Date;
    status: 'Pendiente' | 'Completado' | 'Cancelado';
}

const CompraSchema: Schema = new Schema(
    {
        supplier: { type: String, required: true },
        product_name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unit_cost: { type: Number, required: true, min: 0 },
        total_cost: { type: Number, required: true, min: 0 },
        date: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['Pendiente', 'Completado', 'Cancelado'],
            default: 'Pendiente'
        },
    },
    { timestamps: true }
);

// Transform output to include 'id' instead of '_id'
CompraSchema.set('toJSON', {
    transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    },
});

export const Compra = mongoose.models.Compra || mongoose.model<ICompra>('Compra', CompraSchema);
