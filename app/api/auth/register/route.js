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
      app_version = '2.5.0',
    } = body;

    if (!owner_name || (!phone_number && !email)) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال اسم المالك ورقم الهاتف أو البريد الإلكتروني.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // البحث عن التاجر برقم الهاتف أو معرّف الجهاز أو البريد
    const query = [];
    if (phone_number) query.push({ phone_number });
    if (device_id) query.push({ device_id });
    if (email) query.push({ email });

    let existingLicense = null;
    if (query.length > 0) {
      existingLicense = await License.findOne({ $or: query });
    }

    if (existingLicense) {
      // تحديث بيانات التاجر الحالية
      if (owner_name) existingLicense.owner_name = owner_name;
      if (shop_name) existingLicense.shop_name = shop_name;
      if (email) existingLicense.email = email;
      if (currency) existingLicense.currency = currency;
      if (device_id) existingLicense.device_id = device_id;
      if (password_hash) existingLicense.password_hash = password_hash;
      if (app_version) existingLicense.app_version = app_version;
      existingLicense.last_seen_at = new Date();

      await existingLicense.save();

      const expired = new Date() > new Date(existingLicense.expires_at);
      const isActive = existingLicense.status === 'active' && !expired;

      return NextResponse.json({
        success: true,
        is_new: false,
        message: 'تم تسجيل الدخول وتحديث بيانات المتجر بنجاح.',
        license: {
          license_code: existingLicense.license_code,
          status: existingLicense.status,
          is_active: isActive,
          package_type: existingLicense.package_type,
          expires_at: existingLicense.expires_at,
          is_trial: existingLicense.is_trial,
          owner_name: existingLicense.owner_name,
          shop_name: existingLicense.shop_name,
          currency: existingLicense.currency,
        },
      });
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
