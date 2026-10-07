const Claim = require('../models/Claim');
const Item = require('../models/Item');

// @desc    Submit a claim on an item
// @route   POST /api/claims
// @access  Private
const submitClaim = async (req, res, next) => {
  try {
    const { itemId, message } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide itemId and message'
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Cannot claim your own item
    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot claim your own item'
      });
    }

    // Cannot claim an item that is already Claimed or Resolved
    if (item.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: `Cannot claim an item with status: ${item.status}`
      });
    }

    // Cannot submit duplicate claim
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user._id
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a claim for this item'
      });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      message
    });

    res.status(201).json({
      success: true,
      data: claim
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get claims submitted by the current user
// @route   GET /api/claims/my
// @access  Private
const getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({
      claimant: req.user._id
    })
      .populate({
        path: 'item',
        select: 'title description category type location status image date',
        populate: {
          path: 'reportedBy',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all claims for a specific item
// @route   GET /api/claims/item/:itemId
// @access  Private
const getItemClaims = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view claims for this item'
      });
    }

    const claims = await Claim.find({
      item: req.params.itemId
    })
      .populate('claimant', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Approve or reject a claim
// @route   PUT /api/claims/:id
// @access  Private
const updateClaimStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status: Approved or Rejected'
      });
    }

    const claim = await Claim.findById(req.params.id).populate('item');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Only item owner can approve/reject claims
    if (
      claim.item.reportedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this claim'
      });
    }

    claim.status = status;
    await claim.save();

    // When a claim is approved
    if (status === 'Approved') {

      const updatedItem = await Item.findByIdAndUpdate(
        claim.item._id,
        { status: 'Claimed' },
        { new: true }
      );

      console.log('UPDATED ITEM:', updatedItem);

      // Reject all other pending claims
      await Claim.updateMany(
        {
          item: claim.item._id,
          _id: { $ne: claim._id },
          status: 'Pending'
        },
        {
          status: 'Rejected'
        }
      );
    }

    res.status(200).json({
      success: true,
      data: claim
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  submitClaim,
  getMyClaims,
  getItemClaims,
  updateClaimStatus
};