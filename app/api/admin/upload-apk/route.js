import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sajlha_admin_2026';

    if (!authHeader || authHeader !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار أي ملف للرفع' }, { status: 400 });
    }

    if (!file.name.endsWith('.apk')) {
      return NextResponse.json({ error: 'يرجى اختيار ملف بصلالة .apk فقط' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // تجهيز مجلد التنزيل العام
    const publicDownloadsDir = path.join(process.cwd(), 'public', 'downloads');
    try {
      await mkdir(publicDownloadsDir, { recursive: true });
    } catch (_) {}

    const fileName = 'sajlha.apk';
    const filePath = path.join(publicDownloadsDir, fileName);
    await writeFile(filePath, buffer);

    const host = request.headers.get('host') || 'sajlha.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const downloadUrl = `${protocol}://${host}/downloads/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'تم رفع ملف التحديث بنجاح!',
      downloadUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
