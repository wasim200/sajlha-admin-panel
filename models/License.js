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
  fcm_token: {
    type: String,
    default: '',
    trim: true,
  },
  owner_name: {
    type: String,
    required: [true, 'Please provide owner name'],
    trim: true,
  },
  shop_name: {
    type: String,
    default: '',
    trim: true,
  },
  phone_number: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true,
  },
  email: {
    type: String,
    default: '',
    trim: true,
    lowercase: true,
  },
  currency: {
    type: String,
    default: 'YER',
    trim: true,
  },
  profile_image: {
    type: String,
    default: '',
  },
  password_hash: {
    type: String,
    default: '',
  },
  settings: {
    type: Object,
    default: {},
  },
  package_type: {
    type: String,
    enum: ['trial', 'monthly', 'yearly', 'lifetime'],
    default: 'trial',
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'expired'],
    default: 'active',
  },
  is_trial: {
    type: Boolean,
    default: false,
  },
  expires_at: {
    type: Date,
    required: [true, 'Please provide expiration date'],
  },
  ai_scan_count: {
    type: Number,
    default: 0,
  },
  last_check_at: {
    type: Date,
    default: null,
  },
  app_version: {
    type: String,
    default: '2.5.0',
  },
  last_seen_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.License || mongoose.model('License', LicenseSchema);
