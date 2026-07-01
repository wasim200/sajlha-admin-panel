import mongoose from 'mongoose';

const AdminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['create_license', 'update_license', 'delete_license', 'suspend_license', 'activate_license'],
  },
  license_code: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
  },
  ip_address: {
    type: String,
    default: 'unknown',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AdminLog || mongoose.model('AdminLog', AdminLogSchema);
