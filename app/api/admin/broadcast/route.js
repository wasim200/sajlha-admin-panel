import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Broadcast from '../../../../models/Broadcast';

// ذاكرة مؤقتة احتياطية
let inMemoryBroadcasts = [
  {
    id: 'bc_welcome_2026',
    title: '🎉 مرحباً بك في الإصدار الجديد 2.5 من سجلها!',
    body: 'تم إضافة ميزات كشف الحساب المصور الفاخر، معرض الفواتير المتعددة، والبحث الذكي الشامل للسلع والمبالغ.',
    type: 'release',
    date: new Date().toISOString(),
    actionRoute: '/stats',
  },
];

export async function GET(request) {
  try {
    try {
      await dbConnect();
      const docs = await Broadcast.find().sort({ date: -1 }).limit(20);
      if (docs && docs.length > 0) {
        const broadcasts = docs.map(d => ({
          id: d._id.toString(),
          title: d.title,
          body: d.body,
          type: d.type,
          date: d.date ? d.date.toISOString() : new Date().toISOString(),
          actionRoute: d.actionRoute || '',
        }));
        return NextResponse.json({ success: true, broadcasts });
      }
    } catch (_) {
      // إذا تعذر كائن قاعدة البيانات نستعمل الذاكرة المحلية
    }

    return NextResponse.json({
      success: true,
      broadcasts: inMemoryBroadcasts,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sajlha_admin_2026';

    if (!authHeader || authHeader !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.title || !data.body) {
      return NextResponse.json({ error: 'يرجى تقديم العنوان ونص الإشعار' }, { status: 400 });
    }

    let newBroadcast;
    try {
      await dbConnect();
      const created = await Broadcast.create({
        title: data.title,
        body: data.body,
        type: data.type || 'info',
        actionRoute: data.actionRoute || '',
      });
      newBroadcast = {
        id: created._id.toString(),
        title: created.title,
        body: created.body,
        type: created.type,
        date: created.date.toISOString(),
        actionRoute: created.actionRoute,
      };
    } catch (_) {
      newBroadcast = {
        id: `bc_${Date.now()}`,
        title: data.title,
        body: data.body,
        type: data.type || 'info',
        date: new Date().toISOString(),
        actionRoute: data.actionRoute || '',
      };
      inMemoryBroadcasts.unshift(newBroadcast);
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الإشعار بنجاح لكافة التجار',
      broadcast: newBroadcast,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
