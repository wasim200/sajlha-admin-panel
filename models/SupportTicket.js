import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema({
  ticket_number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  sender_name: {
    type: String,
    default: 'تاجر سجلها',
    trim: true,
  },
  shop_name: {
    type: String,
    default: '',
    trim: true,
  },
  phone_number: {
    type: String,
    default: '',
    trim: true,
  },
  device_id: {
    type: String,
    default: '',
    trim: true,
  },
  app_version: {
    type: String,
    default: '2.5.0',
    trim: true,
  },
  type: {
    type: String,
    enum: ['inquiry', 'issue', 'suggestion', 'license_request'],
    default: 'inquiry',
  },
  subject: {
    type: String,
    required: [true, 'يرجى تقديم عنوان للرسالة'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'يرجى تقديم نص الرسالة أو الاستفسار'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new',
  },
  admin_notes: {
    type: String,
    default: '',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
