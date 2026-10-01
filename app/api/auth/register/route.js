import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      owner_name,
      shop_name,
      phone_number,
      email = '',
      currency = 'YER',
      password_hash = '',
      device_id = '',
      fcm_token = '',
      app_version = '2.5.0',
    } = body;

    if (!owner_name || (!phone_number && !email)) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال اسم المالك ورقم الهاتف أو البريد الإلكتروني.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // البحث عن حساب موجود بـ phone_number أو email فقط - بدون device_id لمنع التداخل
    const query = [];
    if (phone_number) query.push({ phone_number });
    if (email) query.push({ email: email.toLowerCase() });

    let existingLicense = null;
    if (query.length > 0) {
      existingLicense = await License.findOne({ $or: query });
    }

    if (existingLicense) {
      // الحساب موجود مسبقاً → أعد خطأ واضح بدلاً من تحديثه بصمت
      return NextResponse.json(
        {
          success: false,
          is_duplicate: true,
          error: 'يوجد حساب مسجل مسبقاً بهذا الرقم أو البريد الإلكتروني. يرجى تسجيل الدخول.',
        },
        { status: 409 }
      );
    }


    // إنشاء اشتراك تجريبي جديد لمدة 7 أيام
    const trialDays = 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + trialDays);

    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const licenseCode = `SAJ-TRIAL-${randomSuffix}`;

    const newLicense = await License.create({
      license_code: licenseCode,
      device_id: device_id || '',
      fcm_token: fcm_token || '',
      owner_name,
      shop_name: shop_name || '',
      phone_number: phone_number || '',
      email: email || '',
      currency: currency || 'YER',
      password_hash: password_hash || '',
      package_type: 'trial',
      status: 'active',
      is_trial: true,
      expires_at: expiresAt,
      app_version: app_version || '2.5.0',
      last_seen_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      is_new: true,
      message: 'تم إنشاء حساب المتجر وتفعيل الفترة التجريبية بنجاح.',
      license: {
        license_code: newLicense.license_code,
        status: newLicense.status,
        is_active: true,
        package_type: newLicense.package_type,
        expires_at: newLicense.expires_at,
        is_trial: newLicense.is_trial,
        owner_name: newLicense.owner_name,
        shop_name: newLicense.shop_name,
        currency: newLicense.currency,
      },
    });

  } catch (error) {
    console.error('Merchant Registration Error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم أثناء تسجيل المتجر.' },
      { status: 500 }
    );
  }
}
