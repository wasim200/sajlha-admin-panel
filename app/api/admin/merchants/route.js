import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const packageType = searchParams.get('package_type') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    await dbConnect();

    const query = {};

    if (search) {
      query.$or = [
        { owner_name: { $regex: search, $options: 'i' } },
        { shop_name: { $regex: search, $options: 'i' } },
        { phone_number: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { license_code: { $regex: search, $options: 'i' } },
        { device_id: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (packageType) {
      query.package_type = packageType;
    }

    const total = await License.countDocuments(query);
    const merchants = await License.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // إحصائيات سريعة
    const totalMerchants = await License.countDocuments();
    const activeCount = await License.countDocuments({
      status: 'active',
      expires_at: { $gt: new Date() },
    });
    const trialCount = await License.countDocuments({
      package_type: 'trial',
      status: 'active',
      expires_at: { $gt: new Date() },
    });
    const expiredCount = await License.countDocuments({
      $or: [{ status: 'expired' }, { expires_at: { $lte: new Date() } }],
    });

    return NextResponse.json({
      success: true,
      data: merchants,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalMerchants,
        active: activeCount,
        trial: trialCount,
        expired: expiredCount,
      },
    });

  } catch (error) {
    console.error('Fetch Merchants Error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل جلب قائمة التجار والمشتركين.' },
      { status: 500 }
    );
  }
}
