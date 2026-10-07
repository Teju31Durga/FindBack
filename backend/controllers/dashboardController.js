const Item = require('../models/Item');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const [totalLost, totalFound, totalClaimed, activeReports, recentItems] =
      await Promise.all([
        Item.countDocuments({ type: 'Lost' }),

        Item.countDocuments({ type: 'Found' }),

        Item.countDocuments({ status: 'Claimed' }),

        Item.countDocuments({ status: 'Active' }),

        Item.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('reportedBy', 'name email')
          .select(
            'title type category status location createdAt image'
          )
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalLost,
        totalFound,
        totalClaimed,
        activeReports,
        recentItems
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };