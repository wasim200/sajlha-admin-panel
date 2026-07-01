import mongoose from 'mongoose';

const ScanLogSchema = new mongoose.Schema({
  license_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'License',
    required: true,
  },
  device_id: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'error'],
    default: 'success',
  },
  error_message: {
    type: String,
    default: '',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ScanLog || mongoose.model('ScanLog', ScanLogSchema);
