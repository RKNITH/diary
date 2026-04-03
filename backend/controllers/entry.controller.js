import Entry from '../models/entry.model.js';
import Diary from '../models/diary.model.js';

// GET /api/entries/diary/:diaryId
export const getEntriesByDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.diaryId);
    if (!diary) return res.status(404).json({ message: 'Diary not found.' });

    const entries = await Entry.find({ diaryId: req.params.diaryId }).sort({ serialNumber: 1 });

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

    res.status(200).json({ success: true, entries, totals, diary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/entries/:id (admin only) - update a single entry
export const updateEntry = async (req, res) => {
  try {
    const { heading, doneAmount, dueAmount, pendingAmount } = req.body;

    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        heading,
        doneAmount: doneAmount ?? 0,
        dueAmount: dueAmount ?? 0,
        pendingAmount: pendingAmount ?? 0,
      },
      { new: true, runValidators: true }
    );

    if (!entry) return res.status(404).json({ message: 'Entry not found.' });

    res.status(200).json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/entries/diary/:diaryId/bulk (admin only) - bulk update entries
export const bulkUpdateEntries = async (req, res) => {
  try {
    const { entries } = req.body; // array of { _id, heading, doneAmount, dueAmount, pendingAmount }

    if (!Array.isArray(entries)) {
      return res.status(400).json({ message: 'entries must be an array.' });
    }

    const updateOps = entries.map((entry) => ({
      updateOne: {
        filter: { _id: entry._id },
        update: {
          $set: {
            heading: entry.heading || '',
            doneAmount: entry.doneAmount ?? 0,
            dueAmount: entry.dueAmount ?? 0,
            pendingAmount: entry.pendingAmount ?? 0,
          },
        },
      },
    }));

    await Entry.bulkWrite(updateOps);

    // Return updated entries with totals
    const diaryId = req.params.diaryId;
    const updatedEntries = await Entry.find({ diaryId }).sort({ serialNumber: 1 });

    const totals = updatedEntries.reduce(
      (acc, e) => {
        acc.totalDone += e.doneAmount;
        acc.totalDue += e.dueAmount;
        acc.totalPending += e.pendingAmount;
        return acc;
      },
      { totalDone: 0, totalDue: 0, totalPending: 0 }
    );
    totals.grandTotal = totals.totalDone + totals.totalDue + totals.totalPending;

    res.status(200).json({ success: true, entries: updatedEntries, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
