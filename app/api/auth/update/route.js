import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone_number, device_id, new_phone_number, owner_name, shop_name } = body;

    if (!phone_number) {
      return NextResponse.json(
        { success: false, error: 'رقم الهاتف القديم مطلوب للمصادقة.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // البحث عن الحساب باستخدام رقم الهاتف القديم
    const query = { phone_number };
    
    // يفضل التأكد من رقم الجهاز إذا كان متوفراً لمزيد من الأمان
    if (device_id) {
      query.device_id = device_id;
    }

    const license = await License.findOne(query);

    if (!license) {
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على الحساب أو أن رقم الجهاز غير متطابق.' },
        { status: 404 }
      );
    }

    // إذا كان هناك تغيير في رقم الهاتف، يجب التأكد من أن الرقم الجديد غير مستخدم
    if (new_phone_number && new_phone_number !== phone_number) {
      const existingNew = await License.findOne({ phone_number: new_phone_number });
      if (existingNew) {
        return NextResponse.json(
          { success: false, error: 'رقم الهاتف الجديد مستخدم مسبقاً لحساب آخر.' },
          { status: 400 }
        );
      }
      license.phone_number = new_phone_number;
    }

    // تحديث البيانات الأخرى
    if (owner_name) license.owner_name = owner_name;
    if (shop_name) license.shop_name = shop_name;

    await license.save();

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات الحساب بنجاح',
      data: {
        phone_number: license.phone_number,
        owner_name: license.owner_name,
        shop_name: license.shop_name
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم أثناء تحديث البيانات.' },
      { status: 500 }
    );
  }
}
