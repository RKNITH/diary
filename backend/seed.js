import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/admin.model.js';
import Diary from './models/diary.model.js';
import Entry from './models/entry.model.js';

dotenv.config();

const ROWS_PER_DIARY = 50;

const createBlankEntries = async (diaryId, diaryNumber) => {
  const startSerial = (diaryNumber - 1) * ROWS_PER_DIARY + 1;
  const entries = Array.from({ length: ROWS_PER_DIARY }, (_, i) => ({
    diaryId,
    serialNumber: startSerial + i,
    heading: '',
    doneAmount: 0,
    dueAmount: 0,
    pendingAmount: 0,
  }));
  await Entry.insertMany(entries);
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Diary.deleteMany({});
    await Entry.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin
    const admin = await Admin.create({
      username: 'admin',
      password: '123456',
    });
    console.log(`👤 Admin created: username=admin, password=admin123456`);

    // Create 2 sample diaries
    for (let i = 1; i <= 2; i++) {
      const startSerial = (i - 1) * ROWS_PER_DIARY + 1;
      const endSerial = i * ROWS_PER_DIARY;
      const diary = await Diary.create({
        diaryNumber: i,
        title: `Sample Diary ${i}`,
        description: `Covers serial numbers ${startSerial}–${endSerial}`,
        startSerial,
        endSerial,
      });
      await createBlankEntries(diary._id, i);
      console.log(`📓 Diary #${i} created (serials ${startSerial}–${endSerial})`);
    }

    console.log('\n✨ Seed complete!');
    console.log('👉 Login with: POST /api/auth/login  { "username": "admin", "password": "123456" }');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
