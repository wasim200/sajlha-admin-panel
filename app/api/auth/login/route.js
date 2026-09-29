import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';

/**
 * POST /api/auth/login
 * تسجيل الدخول لتاجر موجود مسبقاً
 * البحث يكون بـ phone_number أو email فقط - بدون device_id لمنع ثغرة الوصول عبر الجهاز
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      phone_number = '',
      email = '',
      password_hash = '',
      device_id = '',
      app_version = '',
    } = body;

    // التحقق من وجود معرف الدخول
    if (!phone_number && !email) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // البحث بـ phone_number أو email فقط - لا device_id هنا أبداً
    const query = [];
    if (phone_number) query.push({ phone_number });
    if (email) query.push({ email: email.toLowerCase() });

    const license = await License.findOne({ $or: query });

    // الحساب غير موجود في قاعدة البيانات
    if (!license) {
      return NextResponse.json(
        {
          success: false,
          error: 'لم يتم العثور على حساب بهذا الرقم أو البريد. يرجى إنشاء حساب جديد.',
        },
        { status: 404 }
      );
    }

    // التحقق من كلمة المرور إذا كان الحساب لديه كلمة مرور مُعيَّنة
    if (license.password_hash && license.password_hash.trim() !== '') {
      if (!password_hash || password_hash.trim() === '') {
        return NextResponse.json(
          { success: false, error: 'يرجى إدخال كلمة المرور.' },
          { status: 401 }
        );
      }
      if (license.password_hash !== password_hash.trim()) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور غير صحيحة.' },
          { status: 401 }
        );
      }
    }

    // التحقق من حالة الرخصة
    const now = new Date();
    const expDate = new Date(license.expires_at);
    const expired = now > expDate;

    if (expired && license.status === 'active') {
      license.status = 'expired';
    }

    // تحديث device_id إذا تغيّر الجهاز (ربط الجهاز الجديد بالحساب)
    if (device_id && device_id !== license.device_id) {
      license.device_id = device_id;
    }

    if (app_version) license.app_version = app_version;
    license.last_seen_at = new Date();

    await license.save();

    const isActive = license.status === 'active' && !expired;
    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      active: isActive,
      owner_name: license.owner_name,
      shop_name: license.shop_name,
      phone_number: license.phone_number,
      email: license.email,
      currency: license.currency || 'YER',
      status: license.status,
      expires_at: license.expires_at,
      package_type: diffDays > 3650 ? 'lifetime' : (license.package_type || 'trial'),
      is_trial: license.is_trial ?? true,
      license_code: license.license_code,
    });

  } catch (error) {
    console.error('Merchant Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم أثناء تسجيل الدخول.' },
      { status: 500 }
    );
  }
}
