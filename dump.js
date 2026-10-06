import mongoose from 'mongoose';
import dbConnect from './lib/db.js';
import CashbookEntry from './models/CashbookEntry.js';

async function check() {
  await dbConnect();
  const entries = await CashbookEntry.find({});
  console.log("Cashbook Entries in DB:", entries);
  process.exit(0);
}
check();
