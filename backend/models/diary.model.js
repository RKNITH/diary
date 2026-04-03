import mongoose from 'mongoose';

const diarySchema = new mongoose.Schema(
  {
    diaryNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Diary title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    startSerial: {
      type: Number,
      required: true,
    },
    endSerial: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: entries for this diary
diarySchema.virtual('entries', {
  ref: 'Entry',
  localField: '_id',
  foreignField: 'diaryId',
});

export default mongoose.model('Diary', diarySchema);
