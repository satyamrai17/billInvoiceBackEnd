const mongoose = require('mongoose');

const customarSchema = new mongoose.Schema({
  companyName: String,
  name: String,
  address: String,
  country: String,
  phone: String,
  email: String,
  // password: String,
  billingAddress: String,
  state: String,
  pincode: String,
  city: String,
  gstRegistered: Boolean,
  gstin: String,
  pan: String,
  remainingBalance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Customar', customarSchema);
