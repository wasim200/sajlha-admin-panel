import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import AdminLog from '../../../../models/AdminLog';
import { checkRateLimit, rateLimitResponse } from '../../../../lib/rateLimit';

function checkAuth(request) {
  const rateCheck = checkRateLimit(request, {
    maxRequests: 30,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'admin_logs_auth',
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
    // جلب آخر 50 سجل نشاط
    const logs = await AdminLog.find().sort({ created_at: -1 }).limit(50);

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
