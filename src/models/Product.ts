import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  variantPrices?: {
    '1m'?: number;
    '2m'?: number;
    '3m'?: number;
  };
  images: string[];
  category: string;
  benefits: string[];
  ingredients: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  variantPrices: {
    '1m': { type: Number },
    '2m': { type: Number },
    '3m': { type: Number },
  },
  images: [{ type: String }],
  category: { type: String, required: true },
  benefits: [{ type: String }],
  ingredients: [{ type: String }],
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);