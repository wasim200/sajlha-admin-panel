import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import SupportTicket from '../../../../models/SupportTicket';
import AdminLog from '../../../../models/AdminLog';
import { checkRateLimit, rateLimitResponse } from '../../../../lib/rateLimit';

export const dynamic = 'force-dynamic';

function checkAuth(request) {
  const rateCheck = checkRateLimit(request, {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'admin_support_auth',
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
    if (auth.rateLimited) return rateLimitResponse(auth.retryAfterMs);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (type && type !== 'all') {
      query.type = type;
    }
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { ticket_number: searchRegex },
        { sender_name: searchRegex },
        { shop_name: searchRegex },
        { phone_number: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    const tickets = await SupportTicket.find(query).sort({ created_at: -1 }).limit(100);

    // احتساب الإحصائيات الشاملة
    const allTickets = await SupportTicket.find({}, 'status');
    const stats = {
      total: allTickets.length,
      new: allTickets.filter(t => t.status === 'new').length,
      in_progress: allTickets.filter(t => t.status === 'in_progress').length,
      resolved: allTickets.filter(t => t.status === 'resolved').length,
      closed: allTickets.filter(t => t.status === 'closed').length,
    };

    return NextResponse.json({ tickets, stats });
  } catch (error) {
    console.error('Admin support tickets fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = checkAuth(request);
    if (auth.rateLimited) return rateLimitResponse(auth.retryAfterMs);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرّف التذكرة مطلوب' }, { status: 400 });
    }

    await dbConnect();
    const updateData = { updated_at: new Date() };
    if (status) updateData.status = status;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;

    const updatedTicket = await SupportTicket.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedTicket) {
      return NextResponse.json({ error: 'لم يتم العثور على التذكرة' }, { status: 404 });
    }

    try {
      await AdminLog.create({
        action: 'تحديث حالة تذكرة دعم',
        details: `تم تحديث تذكرة [${updatedTicket.ticket_number}] إلى الحالة (${updatedTicket.status})`,
      });
    } catch {}

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = checkAuth(request);
    if (auth.rateLimited) return rateLimitResponse(auth.retryAfterMs);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرّف التذكرة مطلوب' }, { status: 400 });
    }

    await dbConnect();
    const deleted = await SupportTicket.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'لم يتم العثور على التذكرة' }, { status: 404 });
    }

    try {
      await AdminLog.create({
        action: 'حذف تذكرة دعم',
        details: `تم حذف تذكرة الدعم [${deleted.ticket_number}]`,
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
