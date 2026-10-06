require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const License = require('./models/License').default;
  const Customer = require('./models/Customer').default;
  const Debt = require('./models/Debt').default;

  const licenses = await License.find().lean();
  console.log('Licenses:', JSON.stringify(licenses, null, 2));

  const customers = await Customer.find().lean();
  console.log('Customers:', JSON.stringify(customers, null, 2));
  
  const debts = await Debt.find().lean();
  console.log('Debts:', JSON.stringify(debts, null, 2));

  mongoose.disconnect();
}

checkDB().catch(console.error);
