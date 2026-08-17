import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import SupportTicket from '../../../../models/SupportTicket';
import AdminLog from '../../../../models/AdminLog';
import { checkRateLimit, rateLimitResponse } from '../../../../lib/rateLimit';

export async function POST(request) {
  try {
    // حماية Rate Limiting (حد أقصى 10 رسائل دعم لكل IP كل 10 دقائق)
    const rateCheck = checkRateLimit(request, {
      maxRequests: 10,
      windowMs: 10 * 60 * 1000,
      keyPrefix: 'support_submit',
    });

    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.retryAfterMs);
    }

    const body = await request.json();
    const {
      sender_name,
      shop_name,
      phone_number,
      device_id,
      app_version,
      type = 'inquiry',
      subject,
      message,
    } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json({ success: false, error: 'يرجى كتابة عنوان للرسالة' }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: 'يرجى كتابة نص الرسالة أو الاستفسار' }, { status: 400 });
    }

    await dbConnect();

    // توليد رقم تذكرة متسلسل فريد
    const count = await SupportTicket.countDocuments();
    const ticket_number = `TKT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const newTicket = await SupportTicket.create({
      ticket_number,
      sender_name: sender_name?.trim() || 'تاجر سجلها',
      shop_name: shop_name?.trim() || '',
      phone_number: phone_number?.trim() || '',
      device_id: device_id?.trim() || '',
      app_version: app_version?.trim() || '2.5.0',
      type: ['inquiry', 'issue', 'suggestion', 'license_request'].includes(type) ? type : 'inquiry',
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
    });

    // تسجيل العملية في سجل النشاط
    try {
      await AdminLog.create({
        action: 'تذكرة دعم جديدة',
        details: `رسالة جديدة برقم [${ticket_number}] من: ${newTicket.sender_name} (${newTicket.shop_name || 'بدون متجر'}) - نوع: ${type}`,
      });
    } catch {}

    return NextResponse.json({
      success: true,
      ticket_number,
      message: 'تم استلام رسالتك وتذكرتك بنجاح، وسيقوم فريق الدعم الفني بالرد عليك في أقرب وقت.',
      ticket: newTicket,
    });
  } catch (error) {
    console.error('Support ticket submission error:', error);
    return NextResponse.json({ success: false, error: error.message || 'حدث خطأ أثناء إرسال الرسالة' }, { status: 500 });
  }
}
