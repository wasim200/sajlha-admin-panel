import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';

export async function POST(request) {
  try {
    const { device_id } = await request.json();

    if (!device_id) {
      return NextResponse.json(
        { error: 'Missing device_id' },
        { status: 400 }
      );
    }

    await dbConnect();

    const license = await License.findOne({ device_id });

    if (!license) {
      return NextResponse.json({
        active: false,
        message: 'لا يوجد ترخيص مقترن بهذا الجهاز.',
      });
    }

    // التحقق من تاريخ الانتهاء
    const expired = new Date() > new Date(license.expires_at);
    if (expired && license.status === 'active') {
      license.status = 'expired';
      await license.save();
    }

    const isActive = license.status === 'active' && !expired;

    return NextResponse.json({
      active: isActive,
      status: license.status,
      expires_at: license.expires_at,
      package_type: license.package_type,
    });

  } catch (error) {
    console.error('License Check Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق من الرخصة.' },
      { status: 500 }
    );
  }
}
