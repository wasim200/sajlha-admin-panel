import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import { checkRateLimit, rateLimitResponse } from '../../../../lib/rateLimit';

function checkAuth(request) {
  const rateCheck = checkRateLimit(request, {
    maxRequests: 30,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'admin_analytics_auth',
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
    const licenses = await License.find().sort({ created_at: -1 });

    // ───── 1. نمو التسجيلات والإيرادات الشهرية (آخر 12 شهر) ─────
    const monthlyData = [];
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const monthLicenses = licenses.filter(l => {
        const createdAt = new Date(l.created_at);
        return createdAt >= monthStart && createdAt < monthEnd;
      });

      let monthRevenue = 0;
      monthLicenses.forEach(l => {
        if (l.package_type === 'monthly') monthRevenue += 8;
        else if (l.package_type === 'yearly') monthRevenue += 14;
        else if (l.package_type === 'lifetime') monthRevenue += 28;
      });

      monthlyData.push({
        month: arabicMonths[d.getMonth()],
        year: d.getFullYear(),
        registrations: monthLicenses.length,
        revenue: monthRevenue,
      });
    }

    // ───── 2. توزيع الباقات ─────
    const packageDistribution = [
      { name: '6 أشهر', value: licenses.filter(l => l.package_type === 'monthly').length, color: '#B08B4E' },
      { name: 'سنوية', value: licenses.filter(l => l.package_type === 'yearly').length, color: '#131626' },
      { name: 'سنتين', value: licenses.filter(l => l.package_type === 'lifetime').length, color: '#C6A46A' },
    ];

    // ───── 3. آخر 5 تسجيلات حديثة ─────
    const recentRegistrations = licenses.slice(0, 5).map(l => ({
      id: l._id,
      owner_name: l.owner_name,
      phone_number: l.phone_number,
      package_type: l.package_type,
      status: l.status,
      created_at: l.created_at,
      expires_at: l.expires_at,
    }));

    // ───── 4. مؤشرات أداء إضافية (KPIs) ─────
    const totalLicenses = licenses.length;
    const activeLicenses = licenses.filter(l => l.status === 'active' && new Date(l.expires_at) > now).length;
    const conversionRate = totalLicenses > 0 ? Math.round((activeLicenses / totalLicenses) * 100) : 0;

    let totalRevenue = 0;
    licenses.forEach(l => {
      if (l.package_type === 'monthly') totalRevenue += 8;
      else if (l.package_type === 'yearly') totalRevenue += 14;
      else if (l.package_type === 'lifetime') totalRevenue += 28;
    });
    const arpu = totalLicenses > 0 ? Math.round((totalRevenue / totalLicenses) * 100) / 100 : 0;

    // عدد التسجيلات هذا الشهر مقارنة بالشهر الماضي
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthCount = licenses.filter(l => new Date(l.created_at) >= thisMonthStart).length;
    const lastMonthCount = licenses.filter(l => {
      const d = new Date(l.created_at);
      return d >= lastMonthStart && d < thisMonthStart;
    }).length;
    const growthRate = lastMonthCount > 0 ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100) : (thisMonthCount > 0 ? 100 : 0);

    return NextResponse.json({
      success: true,
      analytics: {
        monthlyData,
        packageDistribution,
        recentRegistrations,
        kpis: {
          conversionRate,
          arpu,
          thisMonthCount,
          lastMonthCount,
          growthRate,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
