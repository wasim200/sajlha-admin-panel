import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import License from '../../../../models/License';
import Customer from '../../../../models/Customer';
import Debt from '../../../../models/Debt';
import Payment from '../../../../models/Payment';
import Activity from '../../../../models/Activity';
import CashbookEntry from '../../../../models/CashbookEntry';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization'); // Should be Bearer {token}
    // For now, we rely on the merchant's device_id or phone_number sent in body for simplicity
    // until we implement JWT.

    const body = await request.json();
    const { device_id, phone_number, profile, settings, customers = [], debts = [], payments = [], activities = [], cashbook_entries = [], deleted = {} } = body;

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
    let merchantUpdated = false;

    if (profile) {
      if (profile.name) merchant.owner_name = profile.name;
      if (profile.shop_name) merchant.shop_name = profile.shop_name;
      if (profile.phone) merchant.phone_number = profile.phone;
      if (profile.currency) merchant.currency = profile.currency;
      if (profile.profile_image !== undefined) merchant.profile_image = profile.profile_image;
      merchantUpdated = true;
    }

    if (settings && Object.keys(settings).length > 0) {
      merchant.settings = { ...merchant.settings, ...settings };
      merchantUpdated = true;
    }

    if (merchantUpdated) {
      await merchant.save();
    }

    // 2. Process Deletions (Tombstones) FIRST to avoid conflict with upserts
    const deletePromises = [];
    if (deleted.customers && deleted.customers.length > 0) {
      deletePromises.push(Customer.deleteMany({ merchant_id, local_id: { $in: deleted.customers } }));
      // Cascade delete
      deletePromises.push(Debt.deleteMany({ merchant_id, local_customer_id: { $in: deleted.customers } }));
      deletePromises.push(Payment.deleteMany({ merchant_id, local_customer_id: { $in: deleted.customers } }));
      deletePromises.push(Activity.deleteMany({ merchant_id, local_customer_id: { $in: deleted.customers } }));
    }
    if (deleted.debts && deleted.debts.length > 0) {
      deletePromises.push(Debt.deleteMany({ merchant_id, local_id: { $in: deleted.debts } }));
    }
    if (deleted.payments && deleted.payments.length > 0) {
      deletePromises.push(Payment.deleteMany({ merchant_id, local_id: { $in: deleted.payments } }));
    }
    if (deleted.activities && deleted.activities.length > 0) {
      deletePromises.push(Activity.deleteMany({ merchant_id, local_id: { $in: deleted.activities } }));
    }
    if (deleted.cashbook_entries && deleted.cashbook_entries.length > 0) {
      deletePromises.push(CashbookEntry.deleteMany({ merchant_id, local_id: { $in: deleted.cashbook_entries } }));
    }
    await Promise.all(deletePromises);

    // 3. Upsert Customers
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

    // 4. Upsert Debts
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

    // 5. Upsert Payments
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

    // 6. Upsert Activities
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

    // 7. Upsert Cashbook Entries
    const cashbookPromises = cashbook_entries.map(e => 
      CashbookEntry.updateOne(
        { merchant_id, local_id: e.id },
        {
          $set: {
            type: e.type,
            amount: e.amount,
            category: e.category,
            title: e.title,
            date: e.date,
            notes: e.notes,
            payment_method: e.payment_method,
            attachment_path: e.attachment_path,
            local_customer_id: e.customer_id,
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
      ...activityPromises,
      ...cashbookPromises
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Data synced successfully',
      stats: {
        customers: customers.length,
        debts: debts.length,
        payments: payments.length,
        activities: activities.length,
        cashbook_entries: cashbook_entries.length,
      }
    });

  } catch (error) {
    console.error('Push Sync Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
