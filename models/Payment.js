import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  merchant_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'License', 
    required: true,
    index: true 
  },
  local_id: { 
    type: Number, 
    required: true 
  }, // SQLite ID for this payment
  local_customer_id: { 
    type: Number, 
    required: true 
  }, // SQLite ID of the customer it belongs to
  amount: { type: Number, required: true },
  details: { type: String, default: '' },
  date: { type: String, required: true },
}, { 
  timestamps: true 
});

// Index to quickly find/upsert by merchant + local_id
PaymentSchema.index({ merchant_id: 1, local_id: 1 }, { unique: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
