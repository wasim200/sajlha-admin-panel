import mongoose from 'mongoose';

const CashbookEntrySchema = new mongoose.Schema({
  merchant_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'License', 
    required: true,
    index: true 
  },
  local_id: { 
    type: Number, 
    required: true 
  },
  type: { type: String, required: true }, // 'income' or 'expense'
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String, default: '' },
  payment_method: { type: String, default: 'cash' },
  attachment_path: { type: String, default: '' },
  base64_data: { type: String, default: '' },
  local_customer_id: { type: Number, default: null }, // Maps to customer_id in SQLite
}, { 
  timestamps: true 
});

CashbookEntrySchema.index({ merchant_id: 1, local_id: 1 }, { unique: true });

export default mongoose.models.CashbookEntry || mongoose.model('CashbookEntry', CashbookEntrySchema);
