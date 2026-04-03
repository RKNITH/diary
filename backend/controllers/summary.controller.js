import Entry from '../models/entry.model.js';
import Diary from '../models/diary.model.js';

// GET /api/summary - global totals across all diaries
export const getGlobalSummary = async (req, res) => {
  try {
    const diaries = await Diary.find({ isActive: true }).sort({ diaryNumber: 1 });

    const summary = await Entry.aggregate([
      {
        $group: {
          _id: null,
          totalDone: { $sum: '$doneAmount' },
          totalDue: { $sum: '$dueAmount' },
          totalPending: { $sum: '$pendingAmount' },
          totalEntries: { $sum: 1 },
        },
      },
    ]);

    const global = summary[0] || {
      totalDone: 0,
      totalDue: 0,
      totalPending: 0,
      totalEntries: 0,
    };

    global.grandTotal = global.totalDone + global.totalDue + global.totalPending;
    global.totalDiaries = diaries.length;

    // Per diary summary
    const perDiary = await Promise.all(
      diaries.map(async (diary) => {
        const agg = await Entry.aggregate([
          { $match: { diaryId: diary._id } },
          {
            $group: {
              _id: null,
              totalDone: { $sum: '$doneAmount' },
              totalDue: { $sum: '$dueAmount' },
              totalPending: { $sum: '$pendingAmount' },
            },
          },
        ]);
        const t = agg[0] || { totalDone: 0, totalDue: 0, totalPending: 0 };
        t.grandTotal = t.totalDone + t.totalDue + t.totalPending;
        return {
          diaryId: diary._id,
          diaryNumber: diary.diaryNumber,
          title: diary.title,
          startSerial: diary.startSerial,
          endSerial: diary.endSerial,
          ...t,
        };
      })
    );

    res.status(200).json({ success: true, global, perDiary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
