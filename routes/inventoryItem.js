
// routes/inventoryItem.js
const express = require('express');
const { 
  addItem, 
  getAllItems, 
  deleteItem, 
  searchItems, 
  updateItem,
  getItem,
  checkAvailability,
  getItemByName
} = require('../controllers/inventoryItem');

const router = express.Router();

router.post('/add', addItem);
router.get('/', getAllItems);
router.delete('/:id', deleteItem);
router.get('/search/:query', searchItems);
router.put('/:id', updateItem);
router.get('/item/:id', getItem);
router.get('/check', checkAvailability);
router.get('/name/:name', getItemByName); // New route to get item by name

module.exports = router;