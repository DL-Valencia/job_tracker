const express = require('express');
const { body } = require('express-validator');
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes are protected
router.use(protect);

const applicationValidation = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('platform')
    .isIn(['LinkedIn', 'Indeed', 'JobStreet', 'Others'])
    .withMessage('Platform must be LinkedIn, Indeed, JobStreet, or Others'),
  body('status')
    .optional()
    .isIn(['Saved', 'Applied', 'Interview', 'Rejected', 'Offer'])
    .withMessage('Invalid status value'),
  body('jobLink')
    .optional({ checkFalsy: true })
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Job link must be a valid URL'),
  body('dateApplied').optional().isISO8601().withMessage('Date must be a valid date'),
];

router.route('/').get(getApplications).post(applicationValidation, validate, createApplication);

router
  .route('/:id')
  .get(getApplication)
  .put(applicationValidation, validate, updateApplication)
  .delete(deleteApplication);

module.exports = router;
