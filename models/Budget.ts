import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  category: string;
  monthlyLimit: number;
  createdAt: string;
}

const BudgetSchema: Schema = new Schema({
  category: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  monthlyLimit: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

// Add index for category lookups
// BudgetSchema.index({ category: 1 });

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);