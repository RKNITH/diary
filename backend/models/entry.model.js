import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    diaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Diary',
      required: true,
    },
    serialNumber: {
      type: Number,
      required: true,
    },
    heading: {
      type: String,
      trim: true,
      default: '',
    },
    doneAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Compound index: serialNumber must be unique within a diary
entrySchema.index({ diaryId: 1, serialNumber: 1 }, { unique: true });

export default mongoose.model('Entry', entrySchema);
