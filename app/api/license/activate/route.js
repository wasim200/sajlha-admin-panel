import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import { checkRateLimit, rateLimitResponse } from '../../../../lib/rateLimit';

export async function POST(request) {
  try {
    // Rate Limiting: حد أقصى 10 محاولات تفعيل لكل IP كل 15 دقيقة
    const rateCheck = checkRateLimit(request, {
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
      keyPrefix: 'license_activate',
    });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.retryAfterMs);
    }

    const { license_code, device_id } = await request.json();

    if (!license_code || !device_id) {
      return NextResponse.json(
        { error: 'Missing license_code or device_id' },
        { status: 400 }
      );
    }

    await dbConnect();

    // البحث عن الترخيص
    const license = await License.findOne({ license_code: license_code.trim().toUpperCase() });

    if (!license) {
      return NextResponse.json(
        { error: 'كود الترخيص المدخل غير صحيح. يرجى التأكد منه.' },
        { status: 404 }
      );
    }

    if (license.status !== 'active') {
      return NextResponse.json(
        { error: 'عذراً، هذا الترخيص معطل أو منتهي الصلاحية.' },
        { status: 403 }
      );
    }

    // التحقق من تاريخ الانتهاء
    if (new Date() > new Date(license.expires_at)) {
      license.status = 'expired';
      await license.save();
      return NextResponse.json(
        { error: 'عذراً، كود الترخيص هذا منتهي الصلاحية.' },
        { status: 403 }
      );
    }

    // التحقق من الاقتران بالجهاز
    if (license.device_id && license.device_id !== device_id) {
      return NextResponse.json(
        { error: 'عذراً، هذا الترخيص مفعل بالفعل على جهاز آخر ولا يمكن إعادة استخدامه.' },
        { status: 409 }
      );
    }

    // ربط الترخيص بالجهاز
    if (!license.device_id) {
      license.device_id = device_id;
      await license.save();
    }

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل التطبيق بنجاح سحابياً!',
      expires_at: license.expires_at,
      package_type: license.package_type,
    });

  } catch (error) {
    console.error('License Activation Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الاتصال بالخادم وتفعيل الرخصة.' },
      { status: 500 }
    );
  }
}
