import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import Customer from '../../../../models/Customer';
import Debt from '../../../../models/Debt';
import Payment from '../../../../models/Payment';
import Activity from '../../../../models/Activity';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization'); // Should be Bearer {token}
    // For now, we rely on the merchant's device_id or phone_number sent in body for simplicity
    // until we implement JWT.

    const body = await request.json();
    const { device_id, phone_number, customers = [], debts = [], payments = [], activities = [] } = body;

    if (!device_id && !phone_number) {
      return NextResponse.json({ success: false, error: 'Unauthorized: missing device_id or phone_number' }, { status: 401 });
    }

    await dbConnect();

    // 1. Authenticate Merchant (Find License)
    const query = [];
    if (phone_number) query.push({ phone_number });
    if (device_id) query.push({ device_id });
    
    const merchant = await License.findOne({ $or: query });
    if (!merchant) {
      return NextResponse.json({ success: false, error: 'Merchant not found' }, { status: 404 });
    }

    const merchant_id = merchant._id;

    // 2. Upsert Customers
    const customerPromises = customers.map(c => 
      Customer.updateOne(
        { merchant_id, local_id: c.id },
        {
          $set: {
            name: c.name,
            address: c.address,
            phone: c.phone,
            total_debt: c.total_debt,
            debt_limit: c.debt_limit,
            local_created_at: c.created_at,
          }
        },
        { upsert: true }
      )
    );

    // 3. Upsert Debts
    const debtPromises = debts.map(d => 
      Debt.updateOne(
        { merchant_id, local_id: d.id },
        {
          $set: {
            local_customer_id: d.customer_id,
            amount: d.amount,
            details: d.details,
            date: d.date,
            due_date: d.due_date,
            attachment_path: d.attachment_path,
          }
        },
        { upsert: true }
      )
    );

    // 4. Upsert Payments
    const paymentPromises = payments.map(p => 
      Payment.updateOne(
        { merchant_id, local_id: p.id },
        {
          $set: {
            local_customer_id: p.customer_id,
            amount: p.amount,
            details: p.details,
            date: p.date,
          }
        },
        { upsert: true }
      )
    );

    // 5. Upsert Activities
    const activityPromises = activities.map(a => 
      Activity.updateOne(
        { merchant_id, local_id: a.id },
        {
          $set: {
            local_customer_id: a.customer_id,
            action: a.action,
            amount: a.amount,
            details: a.details,
            date: a.date,
          }
        },
        { upsert: true }
      )
    );

    // Execute all upserts in parallel
    await Promise.all([
      ...customerPromises,
      ...debtPromises,
      ...paymentPromises,
      ...activityPromises
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Data synced successfully',
      stats: {
        customers: customers.length,
        debts: debts.length,
        payments: payments.length,
        activities: activities.length,
      }
    });

  } catch (error) {
    console.error('Push Sync Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
