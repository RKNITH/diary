import Diary from '../models/diary.model.js';
import Entry from '../models/entry.model.js';

const ROWS_PER_DIARY = 50;

// Helper: compute serials for a diary number
const getSerials = (diaryNumber) => {
  const startSerial = (diaryNumber - 1) * ROWS_PER_DIARY + 1;
  const endSerial = diaryNumber * ROWS_PER_DIARY;
  return { startSerial, endSerial };
};

// Helper: create 50 blank entries for a diary
const createBlankEntries = async (diaryId, diaryNumber) => {
  const { startSerial } = getSerials(diaryNumber);
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

// GET /api/diaries
export const getAllDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ isActive: true }).sort({ diaryNumber: 1 });

    // Attach summary totals
    const diariesWithTotals = await Promise.all(
      diaries.map(async (diary) => {
        const entries = await Entry.find({ diaryId: diary._id });
        const totals = entries.reduce(
          (acc, e) => {
            acc.totalDone += e.doneAmount;
            acc.totalDue += e.dueAmount;
            acc.totalPending += e.pendingAmount;
            return acc;
          },
          { totalDone: 0, totalDue: 0, totalPending: 0 }
        );
        totals.grandTotal = totals.totalDone + totals.totalDue + totals.totalPending;
        return { ...diary.toObject(), totals };
      })
    );

    res.status(200).json({ success: true, count: diaries.length, diaries: diariesWithTotals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/diaries/:id
export const getDiaryById = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    if (!diary) return res.status(404).json({ message: 'Diary not found.' });

    const entries = await Entry.find({ diaryId: diary._id }).sort({ serialNumber: 1 });

    const totals = entries.reduce(
      (acc, e) => {
        acc.totalDone += e.doneAmount;
        acc.totalDue += e.dueAmount;
        acc.totalPending += e.pendingAmount;
        return acc;
      },
      { totalDone: 0, totalDue: 0, totalPending: 0 }
    );
    totals.grandTotal = totals.totalDone + totals.totalDue + totals.totalPending;

    res.status(200).json({ success: true, diary: { ...diary.toObject(), entries, totals } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/diaries (admin only)
export const createDiary = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Auto-compute diary number
    const lastDiary = await Diary.findOne().sort({ diaryNumber: -1 });
    const diaryNumber = lastDiary ? lastDiary.diaryNumber + 1 : 1;
    const { startSerial, endSerial } = getSerials(diaryNumber);

    const diary = await Diary.create({
      diaryNumber,
      title,
      description,
      startSerial,
      endSerial,
    });

    // Auto-create 50 blank entries
    await createBlankEntries(diary._id, diaryNumber);

    res.status(201).json({
      success: true,
      message: `Diary #${diaryNumber} created with serials ${startSerial}–${endSerial}`,
      diary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/diaries/:id (admin only)
export const updateDiary = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    const diary = await Diary.findByIdAndUpdate(
      req.params.id,
      { title, description, isActive },
      { new: true, runValidators: true }
    );

    if (!diary) return res.status(404).json({ message: 'Diary not found.' });

    res.status(200).json({ success: true, diary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/diaries/:id (admin only)
export const deleteDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    if (!diary) return res.status(404).json({ message: 'Diary not found.' });

    // Delete all entries for this diary
    await Entry.deleteMany({ diaryId: diary._id });
    await diary.deleteOne();

    res.status(200).json({ success: true, message: 'Diary and all its entries deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
