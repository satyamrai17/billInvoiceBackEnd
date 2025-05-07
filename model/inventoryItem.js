const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  ItemId: String,
  itemName: String,
  category: String,
  quantity: Number,
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
