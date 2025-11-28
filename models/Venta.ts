import mongoose, { Schema, Document } from 'mongoose';

export interface IVenta extends Document {
    client: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    date: Date;
    status: 'Pendiente' | 'Completado' | 'Cancelado';
}

const VentaSchema: Schema = new Schema(
    {
        client: { type: String, required: true },
        product_name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unit_price: { type: Number, required: true, min: 0 },
        total_price: { type: Number, required: true, min: 0 },
        date: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['Pendiente', 'Completado', 'Cancelado'],
            default: 'Completado' // Default to completed for sales usually
        },
    },
    { timestamps: true }
);

// Transform output to include 'id' instead of '_id'
VentaSchema.set('toJSON', {
    transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    },
});

export const Venta = mongoose.models.Venta || mongoose.model<IVenta>('Venta', VentaSchema);
