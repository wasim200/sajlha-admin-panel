import mongoose from 'mongoose';

const DebtAttachmentSchema = new mongoose.Schema({
  merchant_id: {
    type: String,
    required: true,
  },
  local_debt_id: {
    type: Number,
    required: true,
  },
  local_path: {
    type: String,
    required: true,
  },
  base64_data: {
    type: String,
    required: true, // تخزين الصورة كنص لسهولة المزامنة دون الحاجة لخدمات رفع ملفات خارجية
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.DebtAttachment || mongoose.model('DebtAttachment', DebtAttachmentSchema);
