const fs = require('fs');
const mongoose = require('mongoose');

async function dumpDB() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const mongoUriLine = envFile.split('\\n').find(line => line.startsWith('MONGODB_URI='));
  const mongoUri = mongoUriLine.split('=')[1].trim();

  await mongoose.connect(mongoUri);
  
  const LicenseSchema = new mongoose.Schema({}, { strict: false });
  const License = mongoose.model('License', LicenseSchema, 'licenses');

  const CustomerSchema = new mongoose.Schema({}, { strict: false });
  const Customer = mongoose.model('Customer', CustomerSchema, 'customers');

  const licenses = await License.find().lean();
  console.log('Licenses:', JSON.stringify(licenses, null, 2));

  const customers = await Customer.find().lean();
  console.log('Customers:', JSON.stringify(customers, null, 2));

  mongoose.disconnect();
}

dumpDB().catch(console.error);
