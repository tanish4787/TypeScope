import mongoose from 'mongoose';

const metricsSchema = new mongoose.Schema(
  {
    rawWpm: Number,
    netWpm: Number,
    cpm: Number,
    accuracy: Number,
    punctuationAccuracy: Number,
    errorCount: Number,
    backspaceCount: Number
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    sourceText: { type: String, required: true },
    typedText: { type: String, default: '' },
    durationMs: { type: Number, default: 0 },
    metrics: metricsSchema,
    aiFeedback: {
      strengths: [String],
      improvements: [String],
      drills: [String],
      summary: String
    }
  },
  { timestamps: true }
);

export const Session = mongoose.model('Session', sessionSchema);
