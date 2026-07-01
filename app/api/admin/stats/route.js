import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import ScanLog from '../../../../models/ScanLog';
import { checkRateLimit, rateLimitResponse } from '../../../../lib/rateLimit';

function checkAuth(request) {
  const rateCheck = checkRateLimit(request, {
    maxRequests: 30,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'admin_stats_auth',
  });

  if (!rateCheck.allowed) {
    return { authorized: false, rateLimited: true, retryAfterMs: rateCheck.retryAfterMs };
  }

  const authHeader = request.headers.get('Authorization');
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sajlha_admin_2026';
  
  if (!authHeader || authHeader !== ADMIN_PASSWORD) {
    return { authorized: false, rateLimited: false };
  }
  return { authorized: true, rateLimited: false };
}

export async function GET(request) {
  try {
    const auth = checkAuth(request);
    if (auth.rateLimited) {
      return rateLimitResponse(auth.retryAfterMs);
    }
    if (!auth.authorized) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    await dbConnect();
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const licenses = await License.find();

    // 1. حسابات الحالات العامة
    const totalLicenses = licenses.length;
    const activeLicenses = licenses.filter(l => l.status === 'active' && new Date(l.expires_at) > now).length;
    const expiredLicenses = licenses.filter(l => l.status === 'expired' || new Date(l.expires_at) <= now).length;
    const suspendedLicenses = licenses.filter(l => l.status === 'suspended').length;

    // 2. التراخيص التي تنتهي قريباً (خلال 30 يوم)
    const expiringSoon = licenses.filter(l => 
      l.status === 'active' && 
      new Date(l.expires_at) > now && 
      new Date(l.expires_at) <= thirtyDaysFromNow
    ).length;

    // 3. إجمالي استخدام الذكاء الاصطناعي
    const totalAiScans = licenses.reduce((sum, l) => sum + (l.ai_scan_count || 0), 0);

    // 4. التراخيص حسب نوع الباقة
    const packagesCount = {
      monthly: licenses.filter(l => l.package_type === 'monthly').length,
      yearly: licenses.filter(l => l.package_type === 'yearly').length,
      lifetime: licenses.filter(l => l.package_type === 'lifetime').length,
    };

    // 5. تقدير الإيرادات الإجمالية بناءً على الأسعار المعتمدة (8$ للشهري/6أشهر، 14$ للسنوي، 28$ للسنتين/الأبدي)
    let totalRevenue = 0;
    licenses.forEach(l => {
      if (l.package_type === 'monthly') totalRevenue += 8;
      else if (l.package_type === 'yearly') totalRevenue += 14;
      else if (l.package_type === 'lifetime') totalRevenue += 28;
    });

    // 6. آخر 10 عمليات مسح للذكاء الاصطناعي (مفيدة للشاشات الفرعية)
    const recentScans = await ScanLog.find()
      .populate('license_id', 'owner_name license_code')
      .sort({ created_at: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        totalLicenses,
        activeLicenses,
        expiredLicenses,
        suspendedLicenses,
        expiringSoon,
        totalAiScans,
        packagesCount,
        totalRevenue,
      },
      recentScans,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
