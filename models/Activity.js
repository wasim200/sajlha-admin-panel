import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  merchant_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'License', 
    required: true,
    index: true 
  },
  local_id: { 
    type: Number, 
    required: true 
  }, // SQLite ID for this activity
  local_customer_id: { 
    type: Number, 
    default: null 
  }, // SQLite ID of the customer (optional)
  action: { type: String, required: true },
  amount: { type: Number, default: 0 },
  details: { type: String, default: '' },
  date: { type: String, required: true },
}, { 
  timestamps: true 
});

// Index to quickly find/upsert by merchant + local_id
ActivitySchema.index({ merchant_id: 1, local_id: 1 }, { unique: true });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
