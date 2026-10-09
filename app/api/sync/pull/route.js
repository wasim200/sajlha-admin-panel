import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import Customer from '../../../../models/Customer';
import Debt from '../../../../models/Debt';
import Payment from '../../../../models/Payment';
import Activity from '../../../../models/Activity';
import CashbookEntry from '../../../../models/CashbookEntry';
import DebtAttachment from '../../../../models/DebtAttachment';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone_number = searchParams.get('phone_number');
    const device_id = searchParams.get('device_id');

    if (!device_id && !phone_number) {
      return NextResponse.json({ success: false, error: 'Unauthorized: missing device_id or phone_number' }, { status: 401 });
    }

    await dbConnect();

    // 1. Authenticate Merchant
    const query = [];
    if (phone_number) query.push({ phone_number });
    if (device_id) query.push({ device_id });
    
    const merchant = await License.findOne({ $or: query });
    if (!merchant) {
      return NextResponse.json({ success: false, error: 'Merchant not found' }, { status: 404 });
    }

    const merchant_id = merchant._id;

    // 2. Fetch all data
    const [customers, debts, payments, activities, cashbook_entries, debt_attachments] = await Promise.all([
      Customer.find({ merchant_id }).select('-_id -__v -merchant_id'),
      Debt.find({ merchant_id }).select('-_id -__v -merchant_id'),
      Payment.find({ merchant_id }).select('-_id -__v -merchant_id'),
      Activity.find({ merchant_id }).select('-_id -__v -merchant_id'),
      CashbookEntry.find({ merchant_id }).select('-_id -__v -merchant_id'),
      DebtAttachment.find({ merchant_id }).select('-_id -__v -merchant_id'),
    ]);

    return NextResponse.json({ 
      success: true, 
      data: {
        profile: {
          name: merchant.owner_name,
          shop_name: merchant.shop_name,
          phone: merchant.phone_number,
          currency: merchant.currency,
          profile_image: merchant.profile_image,
        },
        settings: merchant.settings || {},
        customers,
        debts,
        payments,
        activities,
        cashbook_entries,
        debt_attachments
      }
    });

  } catch (error) {
    console.error('Pull Sync Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
