const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customar',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  customerInfo: {
    name: String,
    gstNumber: String,
    address: String,
    phone: String
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    name: String,
    quantity: Number,
    price: Number,
    discount: Number,
    gstRate: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  totalGST: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi'],
    default: 'cash'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  previousBalance: {
    type: Number,
    default: 0
  },
  remainingBalance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['paid', 'partial', 'unpaid'],
    default: 'unpaid'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);