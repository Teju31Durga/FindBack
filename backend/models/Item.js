const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
  'Electronics',
  'Clothing',
  'Accessories',
  'Documents',
  'Keys',
  'Wallet/Bag',
  'Books',
  'Sports',
  'Pets',
  'Other'
]
  },
  type: {
    type: String,
    required: [true, 'Please specify Lost or Found'],
    enum: ['Lost', 'Found']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please provide the date']
  },
  image: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Active', 'Claimed', 'Resolved'],
    default: 'Active'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', ItemSchema);
