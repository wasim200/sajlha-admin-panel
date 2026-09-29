import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';

export async function POST(request) {
  try {
    const { device_id, phone_number, email, app_version } = await request.json();

    if (!device_id && !phone_number && !email) {
      return NextResponse.json(
        { error: 'Missing device_id, phone_number, or email' },
        { status: 400 }
      );
    }

    await dbConnect();

    let license = null;
    
    // الأولوية 1: البحث برقم الهاتف أو البريد (إذا كان المستخدم مسجلاً دخوله)
    if (phone_number || email) {
      const authQuery = [];
      if (phone_number) authQuery.push({ phone_number });
      if (email) authQuery.push({ email });
      license = await License.findOne({ $or: authQuery });
    }

    // الأولوية 2: إذا لم يجد شيئاً أو لم يكن المستخدم مسجلاً، نبحث برقم الجهاز
    if (!license && device_id) {
      // جلب أحدث رخصة نشطة أو غير موقوفة تخص هذا الجهاز
      license = await License.findOne({ device_id }).sort({ created_at: -1 });
    }

    if (!license) {
      return NextResponse.json({
        active: false,
        message: 'لا يوجد ترخيص مقترن بهذا الحساب أو الجهاز.',
      });
    }

    if (app_version) {
      license.app_version = app_version;
    }
    if (device_id && !license.device_id) {
      license.device_id = device_id;
    }
    license.last_seen_at = new Date();

    // التحقق من تاريخ الانتهاء ونوع الباقة
    const now = new Date();
    const expDate = new Date(license.expires_at);
    const expired = now > expDate;
    if (expired && license.status === 'active') {
      license.status = 'expired';
    }

    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays > 3650 && license.package_type !== 'lifetime') {
      license.package_type = 'lifetime';
      license.is_trial = false;
    }

    await license.save();

    const isActive = license.status === 'active' && !expired;

    return NextResponse.json({
      active: isActive,
      status: license.status,
      expires_at: license.expires_at,
      package_type: license.package_type || (diffDays > 3650 ? 'lifetime' : 'trial'),
      is_trial: license.package_type === 'lifetime' ? false : (license.is_trial ?? (license.package_type === 'trial' || !license.package_type)),
      owner_name: license.owner_name,
      shop_name: license.shop_name,
      phone_number: license.phone_number,
      currency: license.currency || 'YER',
      app_version: license.app_version,
    });

  } catch (error) {
    console.error('License Check Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق من الرخصة.' },
      { status: 500 }
    );
  }
}
