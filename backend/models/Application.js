const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Job title cannot exceed 200 characters'],
    },
    jobDescription: {
      type: String,
      trim: true,
    },
    jobLink: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL starting with http or https'],
    },
    platform: {
      type: String,
      enum: {
        values: ['LinkedIn', 'Indeed', 'JobStreet', 'Others'],
        message: '{VALUE} is not a supported platform',
      },
      required: [true, 'Platform is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Saved', 'Applied', 'Interview', 'Rejected', 'Offer'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Applied',
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient filtering
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, platform: 1 });
applicationSchema.index({ userId: 1, dateApplied: -1 });
applicationSchema.index({ userId: 1, companyName: 'text', jobTitle: 'text' });

module.exports = mongoose.model('Application', applicationSchema);
