import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import License from '../../../../../models/License';

export async function POST(request) {
  try {
    const {
      license_id,
      action, // 'renew_month', 'renew_year', 'set_lifetime', 'set_trial', 'suspend', 'activate', 'custom_days'
      custom_days = 30,
      notes = '',
    } = await request.json();

    if (!license_id) {
      return NextResponse.json(
        { success: false, error: 'معرّف التاجر مطلوب.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const merchant = await License.findById(license_id);
    if (!merchant) {
      return NextResponse.json(
        { success: false, error: 'التاجر غير موجود.' },
        { status: 404 }
      );
    }

    const now = new Date();
    // إذا كان الاشتراك منتهياً، نبدأ الحساب من تاريخ اليوم، وإلا نمدد على التاريخ الحالي
    let baseDate = new Date(merchant.expires_at) > now ? new Date(merchant.expires_at) : new Date();

    switch (action) {
      case 'renew_month':
        baseDate.setDate(baseDate.getDate() + 30);
        merchant.expires_at = baseDate;
        merchant.package_type = 'monthly';
        merchant.status = 'active';
        merchant.is_trial = false;
        break;

      case 'renew_year':
        baseDate.setDate(baseDate.getDate() + 365);
        merchant.expires_at = baseDate;
        merchant.package_type = 'yearly';
        merchant.status = 'active';
        merchant.is_trial = false;
        break;

      case 'set_lifetime':
        baseDate.setFullYear(baseDate.getFullYear() + 100);
        merchant.expires_at = baseDate;
        merchant.package_type = 'lifetime';
        merchant.status = 'active';
        merchant.is_trial = false;
        break;

      case 'set_trial':
        const trialDate = new Date();
        trialDate.setDate(trialDate.getDate() + (custom_days || 7));
        merchant.expires_at = trialDate;
        merchant.package_type = 'trial';
        merchant.status = 'active';
        merchant.is_trial = true;
        break;

      case 'custom_days':
        const days = parseInt(custom_days || 30, 10);
        baseDate.setDate(baseDate.getDate() + days);
        merchant.expires_at = baseDate;
        merchant.status = 'active';
        if (days > 3650) {
          merchant.package_type = 'lifetime';
          merchant.is_trial = false;
        } else if (days >= 300) {
          merchant.package_type = 'yearly';
          merchant.is_trial = false;
        } else if (days >= 25) {
          merchant.package_type = 'monthly';
          merchant.is_trial = false;
        }
        break;

      case 'suspend':
        merchant.status = 'suspended';
        break;

      case 'activate':
        merchant.status = 'active';
        if (new Date(merchant.expires_at) <= now) {
          const newExp = new Date();
          newExp.setDate(newExp.getDate() + 30);
          merchant.expires_at = newExp;
        }
        break;

      default:
        break;
    }

    // فحص إضافي: إذا كان تاريخ الانتهاء أكثر من 10 سنوات فهو باقة مدى الحياة حتماً
    const totalRemainingDays = Math.ceil((new Date(merchant.expires_at) - new Date()) / (1000 * 60 * 60 * 24));
    if (totalRemainingDays > 3650) {
      merchant.package_type = 'lifetime';
      merchant.is_trial = false;
    }

    if (notes) {
      merchant.notes = notes;
    }

    await merchant.save();

    return NextResponse.json({
      success: true,
      message: 'تم تحديث اشتراك التاجر بنجاح.',
      merchant,
    });

  } catch (error) {
    console.error('Update Subscription Error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تعديل الاشتراك.' },
      { status: 500 }
    );
  }
}
