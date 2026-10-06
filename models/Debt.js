import mongoose from 'mongoose';

const DebtSchema = new mongoose.Schema({
  merchant_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'License', 
    required: true,
    index: true 
  },
  local_id: { 
    type: Number, 
    required: true 
  }, // SQLite ID for this debt
  local_customer_id: { 
    type: Number, 
    required: true 
  }, // SQLite ID of the customer it belongs to
  amount: { type: Number, required: true },
  details: { type: String, default: '' },
  date: { type: String, required: true },
  due_date: { type: String, default: null },
  attachment_path: { type: String, default: '' }, // We will store the Cloud URL here later
}, { 
  timestamps: true 
});

// Index to quickly find/upsert by merchant + local_id
DebtSchema.index({ merchant_id: 1, local_id: 1 }, { unique: true });

export default mongoose.models.Debt || mongoose.model('Debt', DebtSchema);
