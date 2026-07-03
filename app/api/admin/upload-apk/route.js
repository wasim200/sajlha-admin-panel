import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
      return NextResponse.json({ error: 'يرجى اختيار ملف بصيغة .apk فقط' }, { status: 400 });
    }

    // 1. تجربة الرفع السحابي المباشر عبر محرك التخزين السريع (Catbox / Cloud Host)
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('reqtype', 'fileupload');
      uploadFormData.append('fileToUpload', file);

      const catboxRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: uploadFormData,
      });

      if (catboxRes.ok) {
        const catboxUrl = (await catboxRes.text()).trim();
        if (catboxUrl.startsWith('http')) {
          return NextResponse.json({
            success: true,
            message: 'تم رفع وتوفير ملف الـ APK المباشر بنجاح سحابياً!',
            downloadUrl: catboxUrl,
            fileName: file.name,
            fileSize: file.size,
          });
        }
      }
    } catch (_) {}

    // 2. المحاولة البديلة: التخزين المحلي في مجلد public/downloads
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const publicDownloadsDir = path.join(process.cwd(), 'public', 'downloads');
      await mkdir(publicDownloadsDir, { recursive: true });

      const fileName = 'sajlha.apk';
      const filePath = path.join(publicDownloadsDir, fileName);
      await writeFile(filePath, buffer);

      const host = request.headers.get('host') || 'sajlha.vercel.app';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const downloadUrl = `${protocol}://${host}/downloads/${fileName}`;

      return NextResponse.json({
        success: true,
        message: 'تم حفظ الملف محلياً بنجاح!',
        downloadUrl,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (fsErr) {
      return NextResponse.json({ error: 'تعذر حفظ ملف الـ APK على السيرفر، يرجى استخدام رابط مباشر.' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
