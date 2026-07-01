import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import { checkRateLimit, rateLimitResponse } from '../../../../lib/rateLimit';

// الحماية بكلمة مرور بسيطة لإدارة اللوحة مع Rate Limiting
function checkAuth(request) {
  // Rate Limiting: حد أقصى 5 محاولات دخول فاشلة لكل IP كل 15 دقيقة
  const rateCheck = checkRateLimit(request, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'admin_auth',
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
    const licenses = await License.find().sort({ created_at: -1 });
    
    // حساب الإحصائيات
    const stats = {
      total: licenses.length,
      active: licenses.filter(l => l.status === 'active' && new Date(l.expires_at) > new Date()).length,
      expired: licenses.filter(l => l.status === 'expired' || new Date(l.expires_at) <= new Date()).length,
      suspended: licenses.filter(l => l.status === 'suspended').length,
    };

    return NextResponse.json({ licenses, stats });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = checkAuth(request);
    if (auth.rateLimited) {
      return rateLimitResponse(auth.retryAfterMs);
    }
    if (!auth.authorized) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { owner_name, phone_number, package_type, duration_days } = await request.json();

    if (!owner_name || !phone_number || !duration_days) {
      return NextResponse.json({ error: 'يرجى ملء جميع الحقول المطلوبة' }, { status: 400 });
    }

    await dbConnect();

    // توليد كود ترخيص مميز تلقائياً (SAJ-XXXX-XXXX)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codePart1 = '';
    let codePart2 = '';
    for (let i = 0; i < 4; i++) {
      codePart1 += chars.charAt(Math.floor(Math.random() * chars.length));
      codePart2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const license_code = `SAJ-${codePart1}-${codePart2}`;

    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + parseInt(duration_days));

    const newLicense = await License.create({
      license_code,
      owner_name,
      phone_number,
      package_type,
      expires_at,
      status: 'active'
    });

    return NextResponse.json({ success: true, license: newLicense });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = checkAuth(request);
    if (auth.rateLimited) {
      return rateLimitResponse(auth.retryAfterMs);
    }
    if (!auth.authorized) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { id, status, expires_at } = await request.json();

    await dbConnect();
    const license = await License.findById(id);

    if (!license) {
      return NextResponse.json({ error: 'الترخيص غير موجود' }, { status: 404 });
    }

    if (status) license.status = status;
    if (expires_at) license.expires_at = new Date(expires_at);

    await license.save();
    return NextResponse.json({ success: true, license });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = checkAuth(request);
    if (auth.rateLimited) {
      return rateLimitResponse(auth.retryAfterMs);
    }
    if (!auth.authorized) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { id } = await request.json();

    await dbConnect();
    await License.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
