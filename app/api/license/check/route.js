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

    const query = [];
    if (device_id) query.push({ device_id });
    if (phone_number) query.push({ phone_number });
    if (email) query.push({ email });

    const license = await License.findOne({ $or: query });

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
      package_type: license.package_type || (diffDays > 3650 ? 'lifetime' : 'yearly'),
      is_trial: license.package_type === 'lifetime' ? false : (license.is_trial ?? (license.package_type === 'trial')),
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
