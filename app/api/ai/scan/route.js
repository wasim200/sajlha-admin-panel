import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';

export async function POST(request) {
  try {
    const { image, mimeType, device_id } = await request.json();

    if (!image || !mimeType || !device_id) {
      return NextResponse.json(
        { error: 'Missing required parameters: image, mimeType, device_id' },
        { status: 400 }
      );
    }

    // 1. الاتصال بقاعدة البيانات والتحقق من الترخيص
    await dbConnect();
    const license = await License.findOne({ device_id, status: 'active' });
    
    if (!license) {
      return NextResponse.json(
        { error: 'عذراً، هذا الجهاز لا يملك ترخيصاً نشطاً لتشغيل ميزات الذكاء الاصطناعي. يرجى تفعيل التطبيق أولاً.' },
        { status: 403 }
      );
    }

    // التحقق من تاريخ الانتهاء
    if (new Date() > new Date(license.expires_at)) {
      license.status = 'expired';
      await license.save();
      return NextResponse.json(
        { error: 'عذراً، انتهت صلاحية اشتراكك. يرجى تجديد الترخيص لمواصلة استخدام ميزة المسح الذكي.' },
        { status: 403 }
      );
    }

    // 2. التحضير للاتصال بـ Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API Key للذكاء الاصطناعي غير مهيأ على الخادم.' },
        { status: 500 }
      );
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const prompt = `You are an expert Arabic accounting clerk for a shop bookkeeping application called "سجلها" (Sajlha).
Your task is to analyze this image.

First, determine if the image is indeed a valid financial document (invoice, bill, receipt, or handwritten debt list).
- If the image is NOT a valid financial document (for example, it is a screenshot of a mobile app, a picture of a person, a random object, a landscape, or contains absolutely no readable financial or debt entries):
  Set "is_valid_invoice" to false, and in "description", write a clear, detailed explanation in Arabic explaining why this image is invalid (e.g. "الصورة المرفقة لا تحتوي على أي فواتير أو مستندات محاسبية، بل تظهر كلقطة شاشة لواجهة تطبيق الهاتف"). Set other fields to empty or 0.
- If it is valid:
  Set "is_valid_invoice" to true, and extract:
  1. customer_name: The name of the customer who owes the debt (اسم العميل المدين). If no specific name is mentioned, return a generic name or empty string.
  2. amount: The total debt amount or transaction amount as a double. Look carefully for the final total or amount written.
  3. description: A clear, summarized Arabic description of items bought or context of the debt (e.g. "شراء بضاعة ومواد غذائية").
  4. date: The transaction date in YYYY-MM-DD format. If no date is found, use the current date: "${todayStr}".

You must return ONLY a JSON object matching this schema:
{
  "is_valid_invoice": boolean,
  "customer_name": "string",
  "amount": number,
  "description": "string",
  "date": "string (YYYY-MM-DD)"
}
Do not include any Markdown tags, backticks (like \`\`\`json), or explanations. Return the raw JSON string only.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: image,
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `فشل استدعاء الذكاء الاصطناعي: ${errText}` },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    const textResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse || textResponse.trim().length === 0) {
      return NextResponse.json(
        { error: 'لم يستطع الذكاء الاصطناعي قراءة المستند، يرجى المحاولة بصورة أوضح' },
        { status: 422 }
      );
    }

    let cleanJson = textResponse.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```json\s*|```$/g, '');
    }

    const parsedResult = JSON.parse(cleanJson);
    return NextResponse.json(parsedResult);

  } catch (error) {
    console.error('OCR Proxy Error:', error);
    return NextResponse.json(
      { error: `خطأ داخلي في الخادم: ${error.message}` },
      { status: 500 }
    );
  }
}
