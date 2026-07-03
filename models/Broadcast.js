import mongoose from 'mongoose';

const BroadcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, default: 'info' },
  date: { type: Date, default: Date.now },
  actionRoute: { type: String, default: '' },
});

export default mongoose.models.Broadcast || mongoose.model('Broadcast', BroadcastSchema);
