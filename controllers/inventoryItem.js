

// // controllers/inventoryItem.js
// const InventoryItem = require('../model/inventoryItem');

// // Utility function to send error
// const sendError = (res, status, message) => {
//     return res.status(status).json({ success: false, message });
// };

// const addItem = async (req, res) => {
//   try {
//     const { ItemId, itemName, category, quantity, price } = req.body;
    
//     // Check if item already exists
//     const existingItem = await InventoryItem.findOne({ itemName });
    
//     if (existingItem) {
//       // Update quantity if item exists
//       existingItem.quantity += quantity;
//       existingItem.price = price || existingItem.price;
//       existingItem.category = category || existingItem.category;
//       await existingItem.save();
      
//       return res.status(200).json({ 
//         success: true,
//         message: 'Inventory item updated successfully', 
//         item: existingItem 
//       });
//     }
    
//     // Create new item if it doesn't exist
//     const newItem = new InventoryItem(req.body);
//     await newItem.save();
    
//     res.status(201).json({ 
//       success: true,
//       message: 'Inventory item added successfully',
//       item: newItem
//     });
//   } catch (error) {
//     return sendError(res, 500, error.message);
//   }
// };

// const getAllItems = async (req, res) => {
//   try {
//     const items = await InventoryItem.find();
//     // Return just the array to maintain compatibility with the frontend
//     res.status(200).json(items);
//   } catch (error) {
//     return sendError(res, 500, error.message);
//   }
// };

// const deleteItem = async (req, res) => {
//   try {
//     const item = await InventoryItem.findByIdAndDelete(req.params.id);
    
//     if (!item) {
//       return sendError(res, 404, 'Inventory item not found');
//     }
    
//     res.status(200).json({ 
//       success: true,
//       message: 'Inventory item deleted successfully',
//       item 
//     });
//   } catch (error) {
//     return sendError(res, 500, error.message);
//   }
// };

// const searchItems = async (req, res) => {
//   try {
//     const items = await InventoryItem.find({
//       itemName: { $regex: req.params.query, $options: 'i' },
//     });
    
//     // Return just the array to maintain compatibility with the frontend
//     res.status(200).json(items);
//   } catch (error) {
//     return sendError(res, 500, error.message);
//   }
// };

// const updateItem = async (req, res) => {
//   try {
//     const updatedItem = await InventoryItem.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     );
    
//     if (!updatedItem) {
//       return sendError(res, 404, 'Inventory item not found');
//     }
    
//     res.status(200).json({ 
//       success: true,
//       message: 'Inventory item updated successfully', 
//       item: updatedItem 
//     });
//   } catch (error) {
//     return sendError(res, 500, error.message);
//   }
// };

// // Get single inventory item
// const getItem = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!id) return sendError(res, 400, 'Item ID is required');
    
//     const item = await InventoryItem.findById(id);
    
//     if (!item) return sendError(res, 404, 'Inventory item not found');
    
//     return res.status(200).json({
//       success: true,
//       message: 'Inventory item found',
//       item
//     });
//   } catch (error) {
//     return sendError(res, 500, error.message);
//   }
// };

// // Check availability
// const checkAvailability = async (req, res) => {
//   try {
//     const { itemName, quantity } = req.query;
    
//     if (!itemName) return sendError(res, 400, 'Item name is required');
//     if (!quantity) return sendError(res, 400, 'Quantity is required');
    
//     const item = await InventoryItem.findOne({ itemName });
    
//     if (!item) {
//       return sendError(res, 404, 'Item not found in inventory');
//     }
    
//     const available = item.quantity >= parseInt(quantity);
    
//     return res.status(200).json({
//       success: true,
//       available,
//       currentStock: item.quantity,
//       requestedQuantity: parseInt(quantity)
//     });
//   } catch (error) {
//     return sendError(res, 500, error.message);
//   }
// };

// module.exports = {
//   addItem,
//   getAllItems,
//   deleteItem,
//   searchItems,
//   updateItem,
//   getItem,
//   checkAvailability
// };


// controllers/inventoryItem.js
const InventoryItem = require('../model/inventoryItem');

// Utility function to send error
const sendError = (res, status, message) => {
    return res.status(status).json({ success: false, message });
};

const addItem = async (req, res) => {
  try {
    const { ItemId, itemName, category, quantity, price } = req.body;
    
    // Check if item already exists
    const existingItem = await InventoryItem.findOne({ itemName });
    
    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
      existingItem.price = price || existingItem.price;
      existingItem.category = category || existingItem.category;
      await existingItem.save();
      
      return res.status(200).json({ 
        success: true,
        message: 'Inventory item updated successfully', 
        item: existingItem 
      });
    }
    
    // Create new item if it doesn't exist
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Inventory item added successfully',
      item: newItem
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    // Return just the array to maintain compatibility with the frontend
    res.status(200).json(items);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return sendError(res, 404, 'Inventory item not found');
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Inventory item deleted successfully',
      item 
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const searchItems = async (req, res) => {
  try {
    const items = await InventoryItem.find({
      itemName: { $regex: req.params.query, $options: 'i' },
    });
    
    // Return just the array to maintain compatibility with the frontend
    res.status(200).json(items);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const updateItem = async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!updatedItem) {
      return sendError(res, 404, 'Inventory item not found');
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Inventory item updated successfully', 
      item: updatedItem 
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get single inventory item
const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) return sendError(res, 400, 'Item ID is required');
    
    const item = await InventoryItem.findById(id);
    
    if (!item) return sendError(res, 404, 'Inventory item not found');
    
    return res.status(200).json({
      success: true,
      message: 'Inventory item found',
      item
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Check availability
const checkAvailability = async (req, res) => {
  try {
    const { itemName, quantity } = req.query;
    
    if (!itemName) return sendError(res, 400, 'Item name is required');
    if (!quantity) return sendError(res, 400, 'Quantity is required');
    
    const item = await InventoryItem.findOne({ itemName });
    
    if (!item) {
      return sendError(res, 404, 'Item not found in inventory');
    }
    
    const available = item.quantity >= parseInt(quantity);
    
    return res.status(200).json({
      success: true,
      available,
      currentStock: item.quantity,
      requestedQuantity: parseInt(quantity)
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// NEW ENDPOINT: Get item by name
const getItemByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    if (!name) return sendError(res, 400, 'Item name is required');
    
    const item = await InventoryItem.findOne({ 
      itemName: { $regex: `^${name}$`, $options: 'i' } 
    });
    
    if (!item) return sendError(res, 404, 'Item not found in inventory');
    
    return res.status(200).json({
      success: true,
      message: 'Item found',
      item
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  addItem,
  getAllItems,
  deleteItem,
  searchItems,
  updateItem,
  getItem,
  checkAvailability,
  getItemByName  // Export the new function
};