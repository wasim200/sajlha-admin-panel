import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  merchant_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'License', 
    required: true,
    index: true 
  },
  local_id: { 
    type: Number, 
    required: true 
  }, // The SQLite ID from the merchant's device
  name: { type: String, required: true },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  total_debt: { type: Number, default: 0 },
  debt_limit: { type: Number, default: 0 },
  local_created_at: { type: String, required: true }, // Created at from device
}, { 
  timestamps: true // adds createdAt and updatedAt in MongoDB
});

// Index to quickly find a customer by merchant and local_id during sync
CustomerSchema.index({ merchant_id: 1, local_id: 1 }, { unique: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
