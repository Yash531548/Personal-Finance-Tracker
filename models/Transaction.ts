  import mongoose, { Schema, Document } from 'mongoose';

  export interface ITransaction extends Document {
    amount: number;
    description: string;
    date: string;
    type: 'expense' | 'income';
    category: string;
    createdAt: string;
  }

  const TransactionSchema: Schema = new Schema({
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['expense', 'income'],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  });

  // Add indexes for better query performance
//   if (!mongoose.models.Transaction) {
//   TransactionSchema.index({ date: -1 });
//   TransactionSchema.index({ type: 1 });
//   TransactionSchema.index({ category: 1 });
// }
  export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);