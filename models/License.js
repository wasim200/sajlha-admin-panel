import mongoose from 'mongoose';

const LicenseSchema = new mongoose.Schema({
  license_code: {
    type: String,
    required: [true, 'Please provide a license code'],
    unique: true,
    trim: true,
  },
  device_id: {
    type: String,
    default: '',
    trim: true,
  },
  owner_name: {
    type: String,
    required: [true, 'Please provide owner name'],
    trim: true,
  },
  phone_number: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true,
  },
  package_type: {
    type: String,
    enum: ['monthly', 'yearly', 'lifetime'],
    default: 'yearly',
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'expired'],
    default: 'active',
  },
  expires_at: {
    type: Date,
    required: [true, 'Please provide expiration date'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.License || mongoose.model('License', LicenseSchema);
