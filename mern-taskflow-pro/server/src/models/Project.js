import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Review', 'Completed'],
      default: 'Planning'
    },
    dueDate: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    color: { type: String, default: '#2563eb' }
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);

