import mongoose from 'mongoose';

const AppVersionSchema = new mongoose.Schema({
  latestVersion: { type: String, required: true, default: '2.5.0' },
  minVersion: { type: String, required: true, default: '2.4.0' },
  title: { type: String, default: 'تحديث تطبيق سجلها الجديد' },
  releaseNotes: { type: [String], default: [] },
  downloadUrl: { type: String, default: 'https://sajlha.app' },
  isForceUpdate: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.AppVersion || mongoose.model('AppVersion', AppVersionSchema);
