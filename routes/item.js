const express = require('express');
const router = express.Router();
const {
    allItems,
    addItem,
    deleteItem,
    updateItem,
    getItem
} = require('../controllers/item');


router.get('/', allItems);
router.get('customer/:customerId', allItems);
router.post('/addItem', addItem);
router.delete('/:id', deleteItem);
router.put('/:id', updateItem);
router.get('/:id', getItem);

module.exports = router;