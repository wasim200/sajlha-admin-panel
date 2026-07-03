import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import AppVersion from '../../../../models/AppVersion';

// ذاكرة مؤقتة افتراضية للإصدارات
let memoryVersion = {
  latestVersion: '2.5.0',
  minVersion: '2.4.0',
  title: 'تحديث تطبيق سجلها 2.5 الفخم',
  releaseNotes: [
    'معرض صور الفواتير والمرفقات المتعددة',
    'مشاركة كشف الحساب كصورة عالية الدقة عبر الواتساب',
    'محرك البحث الذكي الشامل للسلع والمبالغ',
    'منتقي التاريخ العصري السريع',
  ],
  downloadUrl: 'https://sajlha.vercel.app',
  isForceUpdate: false,
  updatedAt: new Date().toISOString(),
};

export async function GET(request) {
  try {
    try {
      await dbConnect();
      const doc = await AppVersion.findOne().sort({ updatedAt: -1 });
      if (doc) {
        return NextResponse.json({
          success: true,
          versionInfo: {
            latestVersion: doc.latestVersion,
            minVersion: doc.minVersion,
            title: doc.title,
            releaseNotes: doc.releaseNotes || [],
            downloadUrl: doc.downloadUrl,
            isForceUpdate: doc.isForceUpdate,
            updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
          },
        });
      }
    } catch (_) {}

    return NextResponse.json({
      success: true,
      versionInfo: memoryVersion,
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
    if (!data.latestVersion || !data.minVersion) {
      return NextResponse.json({ error: 'يرجى تحديد رقم الإصدار والأدنى المطلوب' }, { status: 400 });
    }

    const notes = Array.isArray(data.releaseNotes)
      ? data.releaseNotes
      : (data.releaseNotes ? data.releaseNotes.toString().split('\n').filter(Boolean) : []);

    try {
      await dbConnect();
      let doc = await AppVersion.findOne();
      if (!doc) {
        doc = new AppVersion();
      }
      doc.latestVersion = data.latestVersion;
      doc.minVersion = data.minVersion;
      doc.title = data.title || 'تحديث تطبيق سجلها الجديد';
      doc.releaseNotes = notes;
      doc.downloadUrl = data.downloadUrl || 'https://sajlha.vercel.app';
      doc.isForceUpdate = Boolean(data.isForceUpdate);
      doc.updatedAt = new Date();
      await doc.save();

      memoryVersion = {
        latestVersion: doc.latestVersion,
        minVersion: doc.minVersion,
        title: doc.title,
        releaseNotes: doc.releaseNotes,
        downloadUrl: doc.downloadUrl,
        isForceUpdate: doc.isForceUpdate,
        updatedAt: doc.updatedAt.toISOString(),
      };
    } catch (_) {
      memoryVersion = {
        latestVersion: data.latestVersion,
        minVersion: data.minVersion,
        title: data.title || 'تحديث تطبيق سجلها الجديد',
        releaseNotes: notes,
        downloadUrl: data.downloadUrl || 'https://sajlha.vercel.app',
        isForceUpdate: Boolean(data.isForceUpdate),
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث ونشر بيانات إصدار التطبيق بنجاح',
      versionInfo: memoryVersion,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
