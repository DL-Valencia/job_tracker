const Application = require('../models/Application');

// @desc    Get all applications for the logged-in user
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    const {
      search,
      status,
      platform,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Text search
    if (search && search.trim()) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Platform filter
    if (platform && platform !== 'all') {
      query.platform = platform;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.dateApplied = {};
      if (dateFrom) query.dateApplied.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        query.dateApplied.$lte = end;
      }
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Application.countDocuments(query),
    ]);

    // Dashboard metrics (aggregate for logged-in user)
    const [statusMetrics, platformMetrics] = await Promise.all([
      Application.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { _id: '$platform', count: { $sum: 1 } } },
      ]),
    ]);

    const metricMap = { Applied: 0, Interview: 0, Rejected: 0, Offer: 0, Saved: 0 };
    statusMetrics.forEach((m) => {
      metricMap[m._id] = m.count;
    });

    const platformMap = { LinkedIn: 0, Indeed: 0, JobStreet: 0, Others: 0 };
    platformMetrics.forEach((m) => {
      platformMap[m._id] = m.count;
    });

    res.status(200).json({
      success: true,
      data: applications,
      metrics: {
        total,
        ...metricMap,
        platforms: platformMap,
      },
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
};
