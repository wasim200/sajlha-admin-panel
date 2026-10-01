import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import admin from '../../../../lib/firebase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, message, action_route, is_update, is_feature, is_offer } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال عنوان ومحتوى الإشعار.' },
        { status: 400 }
      );
    }

    if (!admin.apps?.length) {
      return NextResponse.json(
        { success: false, error: 'السيرفر غير مربوط بخدمة Firebase حالياً.' },
        { status: 500 }
      );
    }

    await dbConnect();

    // استخراج كافة الـ FCM Tokens من المستخدمين الذين لديهم Token
    const licenses = await License.find({ fcm_token: { $exists: true, $ne: '' } });
    const tokens = licenses.map(l => l.fcm_token);

    if (tokens.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'لا يوجد مستخدمون مسجلون حالياً برمز إشعار (Token).',
      });
    }

    // تجهيز رسالة الإشعار
    const messagePayload = {
      notification: {
        title: title,
        body: message,
      },
      data: {
        action_route: action_route || '',
        is_update: is_update ? 'true' : 'false',
        is_feature: is_feature ? 'true' : 'false',
        is_offer: is_offer ? 'true' : 'false',
      },
      tokens: tokens,
    };

    // إرسال الإشعار لجميع الهواتف دفعة واحدة (Multicast)
    const response = await admin.messaging().sendEachForMulticast(messagePayload);

    return NextResponse.json({
      success: true,
      message: `تم إرسال الإشعار بنجاح. (${response.successCount} نجاح، ${response.failureCount} فشل)`,
      details: response,
    });
  } catch (error) {
    console.error('Send Notification Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ في الخادم أثناء إرسال الإشعار.' },
      { status: 500 }
    );
  }
}
