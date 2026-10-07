const Item = require('../models/Item');
const Claim = require('../models/Claim');

// @desc    Get all items with filters and pagination
// @route   GET /api/items
// @access  Public
const getItems = async (req, res, next) => {
  try {
    const { type, category, location, status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res, next) => {
  try {
    const { title, description, category, type, location, date, status } = req.body;

    const itemData = {
      title,
      description,
      category,
      type,
      location,
      date,
      reportedBy: req.user._id
    };

    if (status) itemData.status = status;
    if (req.file) {
      itemData.image = `/uploads/${req.file.filename}`;
    }

    const item = await Item.create(itemData);

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private (owner only)
const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
    }

    const { title, description, category, type, location, date, status } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) updateData.type = type;
    if (location !== undefined) updateData.location = location;
    if (date !== undefined) updateData.date = date;
    if (status !== undefined) updateData.status = status;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    item = await Item.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (owner only)
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }

    // Delete all associated claims
    await Claim.deleteMany({ item: item._id });

    await item.deleteOne();

    res.status(200).json({ success: true, message: 'Item and associated claims deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get items reported by the current user
// @route   GET /api/items/my
// @access  Private
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, getMyItems }