import { NextResponse } from 'next/server';

// ذاكرة مؤقتة لرسائل البث المباشر (يمكن تعزيزها مع قاعدة البيانات)
let broadcastStore = [
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
    return NextResponse.json({
      success: true,
      broadcasts: broadcastStore,
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

    const newBroadcast = {
      id: `bc_${Date.now()}`,
      title: data.title,
      body: data.body,
      type: data.type || 'info', // 'release', 'alert', 'info', 'offer'
      date: new Date().toISOString(),
      actionRoute: data.actionRoute || '',
    };

    broadcastStore.unshift(newBroadcast);

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الإشعار بنجاح لكافة التجار',
      broadcast: newBroadcast,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
