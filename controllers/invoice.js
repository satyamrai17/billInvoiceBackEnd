// const Invoice = require('../model/invoice');
// // const Customer = require('../models/Customer');

// // Create a new invoice
// exports.createInvoice = async (req, res) => {
//   try {
//     const {
//       customer,
//       invoiceNumber,
//       customerInfo,
//       items,
//       subtotal,
//       totalGST,
//       grandTotal,
//       paymentMethod,
//       amountPaid,
//       previousBalance,
//       remainingBalance
//     } = req.body;

//     // Validate customer
//     if (!customer) {
//       return res.status(400).json({ message: 'Customer ID is required' });
//     }

//     // Determine status based on payment
//     let status = 'unpaid';
//     if (amountPaid > 0) {
//       status = amountPaid >= grandTotal ? 'paid' : 'partial';
//     }

//     // Create new invoice
//     const newInvoice = new Invoice({
//       customer,
//       invoiceNumber,
//       customerInfo,
//       items,
//       subtotal,
//       totalGST,
//       grandTotal,
//       paymentMethod,
//       amountPaid,
//       previousBalance,
//       remainingBalance,
//       status
//     });

//     const savedInvoice = await newInvoice.save();

//     // Respond with invoice details including the generated invoice number
//     res.status(201).json({
//       success: true,
//       invoiceNumber: savedInvoice.invoiceNumber,
//       _id: savedInvoice._id
//     });

//   } catch (error) {
//     console.error('Error creating invoice:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to create invoice',
//       error: error.message 
//     });
//   }
// };

// // Get all invoices
// exports.getAllInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find()
//       .populate('customer', 'name email phone')
//       .sort({ createdAt: -1 });
    
//     res.status(200).json({ success: true, invoices });
//   } catch (error) {
//     console.error('Error getting invoices:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to fetch invoices',
//       error: error.message 
//     });
//   }
// };

// // Get invoices by customer ID
// exports.getInvoicesByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
    
//     if (!customerId) {
//       return res.status(400).json({ message: 'Customer ID is required' });
//     }

//     const invoices = await Invoice.find({ customer: customerId })
//       .sort({ createdAt: -1 });
    
//     res.status(200).json({ success: true, invoices });
//   } catch (error) {
//     console.error('Error getting customer invoices:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to fetch customer invoices',
//       error: error.message 
//     });
//   }
// };

// // Get invoice by ID
// exports.getInvoiceById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const invoice = await Invoice.findById(id)
//       .populate('customer', 'name email phone address')
//       .populate('items.item', 'name price discount');
    
//     if (!invoice) {
//       return res.status(404).json({ message: 'Invoice not found' });
//     }
    
//     res.status(200).json({ success: true, invoice });
//   } catch (error) {
//     console.error('Error getting invoice:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to fetch invoice',
//       error: error.message 
//     });
//   }
// };

// // Update invoice status
// exports.updateInvoiceStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, amountPaid } = req.body;
    
//     const invoice = await Invoice.findById(id);
    
//     if (!invoice) {
//       return res.status(404).json({ message: 'Invoice not found' });
//     }
    
//     // Update status and amount paid if provided
//     if (status) invoice.status = status;
//     if (amountPaid !== undefined) {
//       invoice.amountPaid = amountPaid;
      
//       // Recalculate remaining balance
//       invoice.remainingBalance = invoice.previousBalance + invoice.grandTotal - amountPaid;
      
//       // Auto-update status based on payment
//       if (amountPaid >= invoice.grandTotal) {
//         invoice.status = 'paid';
//       } else if (amountPaid > 0) {
//         invoice.status = 'partial';
//       } else {
//         invoice.status = 'unpaid';
//       }
//     }
    
//     const updatedInvoice = await invoice.save();
    
//     res.status(200).json({ success: true, invoice: updatedInvoice });
//   } catch (error) {
//     console.error('Error updating invoice status:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to update invoice status',
//       error: error.message 
//     });
//   }
// };

// // Delete invoice
// exports.deleteInvoice = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const result = await Invoice.findByIdAndDelete(id);
    
//     if (!result) {
//       return res.status(404).json({ message: 'Invoice not found' });
//     }
    
//     res.status(200).json({ 
//       success: true, 
//       message: 'Invoice deleted successfully' 
//     });
//   } catch (error) {
//     console.error('Error deleting invoice:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to delete invoice',
//       error: error.message 
//     });
//   }
// };







const Invoice = require('../model/invoice');
const InventoryItem = require('../model/inventoryItem');

// Create a new invoice and update inventory
exports.createInvoice = async (req, res) => {
  try {
    const {
      customer,
      invoiceNumber,
      customerInfo,
      items,
      subtotal,
      totalGST,
      grandTotal,
      paymentMethod,
      amountPaid,
      previousBalance,
      remainingBalance
    } = req.body;

    // Validate customer
    if (!customer) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    // Check inventory availability for all items
    const inventoryCheckResults = await Promise.all(
      items.map(async (item) => {
        // Find the inventory item by name (assuming item.name exists in the request)
        const inventoryItem = await InventoryItem.findOne({ itemName: item.name });
        
        if (!inventoryItem) {
          return { 
            available: false, 
            item: item.name, 
            message: 'Item not found in inventory'
          };
        }
        
        if (inventoryItem.quantity < item.quantity) {
          return { 
            available: false, 
            item: item.name, 
            currentStock: inventoryItem.quantity,
            requested: item.quantity,
            message: 'Insufficient stock'
          };
        }
        
        return { available: true, item: item.name, inventoryItem };
      })
    );

    // Check if any items are unavailable
    const unavailableItems = inventoryCheckResults.filter(result => !result.available);
    
    if (unavailableItems.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Some items are unavailable or have insufficient stock',
        unavailableItems
      });
    }

    // Determine status based on payment
    let status = 'unpaid';
    if (amountPaid > 0) {
      status = amountPaid >= grandTotal ? 'paid' : 'partial';
    }

    // Create new invoice
    const newInvoice = new Invoice({
      customer,
      invoiceNumber,
      customerInfo,
      items,
      subtotal,
      totalGST,
      grandTotal,
      paymentMethod,
      amountPaid,
      previousBalance,
      remainingBalance,
      status
    });

    const savedInvoice = await newInvoice.save();

    // Update inventory by reducing quantities
    await Promise.all(
      items.map(async (item) => {
        // Find the corresponding inventory result that we already verified
        const inventoryResult = inventoryCheckResults.find(result => result.item === item.name);
        
        if (inventoryResult && inventoryResult.inventoryItem) {
          // Reduce the quantity in inventory
          inventoryResult.inventoryItem.quantity -= item.quantity;
          await inventoryResult.inventoryItem.save();
        }
      })
    );

    // Respond with invoice details including the generated invoice number
    res.status(201).json({
      success: true,
      invoiceNumber: savedInvoice.invoiceNumber,
      _id: savedInvoice._id,
      message: 'Invoice created and inventory updated successfully'
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create invoice',
      error: error.message 
    });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, invoices });
  } catch (error) {
    console.error('Error getting invoices:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch invoices',
      error: error.message 
    });
  }
};

// Get invoices by customer ID
exports.getInvoicesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const invoices = await Invoice.find({ customer: customerId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: { invoices } });
  } catch (error) {
    console.error('Error getting customer invoices:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch customer invoices',
      error: error.message 
    });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id)
      .populate('customer', 'name email phone address')
      .populate('items.item', 'name price discount');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    console.error('Error getting invoice:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch invoice',
      error: error.message 
    });
  }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amountPaid } = req.body;
    
    const invoice = await Invoice.findById(id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Update status and amount paid if provided
    if (status) invoice.status = status;
    if (amountPaid !== undefined) {
      invoice.amountPaid = amountPaid;
      
      // Recalculate remaining balance
      invoice.remainingBalance = invoice.previousBalance + invoice.grandTotal - amountPaid;
      
      // Auto-update status based on payment
      if (amountPaid >= invoice.grandTotal) {
        invoice.status = 'paid';
      } else if (amountPaid > 0) {
        invoice.status = 'partial';
      } else {
        invoice.status = 'unpaid';
      }
    }
    
    const updatedInvoice = await invoice.save();
    
    res.status(200).json({ success: true, invoice: updatedInvoice });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update invoice status',
      error: error.message 
    });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find invoice before deleting to get items
    const invoice = await Invoice.findById(id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Restore inventory quantities
    if (invoice.items && invoice.items.length > 0) {
      await Promise.all(
        invoice.items.map(async (item) => {
          // Find the inventory item by name
          const inventoryItem = await InventoryItem.findOne({ itemName: item.name });
          
          if (inventoryItem) {
            // Restore the quantity in inventory
            inventoryItem.quantity += item.quantity;
            await inventoryItem.save();
          }
        })
      );
    }
    
    // Delete the invoice
    await Invoice.findByIdAndDelete(id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Invoice deleted successfully and inventory restored' 
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete invoice',
      error: error.message 
    });
  }
};

// Return items to inventory (for canceled invoices or returns)
exports.returnItemsToInventory = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { itemsToReturn } = req.body;
    
    if (!invoiceId) {
      return res.status(400).json({ message: 'Invoice ID is required' });
    }
    
    if (!itemsToReturn || !Array.isArray(itemsToReturn) || itemsToReturn.length === 0) {
      return res.status(400).json({ message: 'Items to return are required' });
    }
    
    const invoice = await Invoice.findById(invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Process each item to return
    const updateResults = await Promise.all(
      itemsToReturn.map(async (returnItem) => {
        // Find the item in the invoice
        const invoiceItem = invoice.items.find(item => 
          item.name === returnItem.name || 
          (item.item && item.item.toString() === returnItem.itemId)
        );
        
        if (!invoiceItem) {
          return { 
            success: false, 
            item: returnItem.name,
            message: 'Item not found in invoice'
          };
        }
        
        // Validate return quantity
        if (returnItem.quantity > invoiceItem.quantity) {
          return { 
            success: false, 
            item: returnItem.name,
            message: 'Return quantity exceeds purchased quantity'
          };
        }
        
        // Find inventory item
        const inventoryItem = await InventoryItem.findOne({ 
          itemName: returnItem.name 
        });
        
        if (!inventoryItem) {
          return { 
            success: false, 
            item: returnItem.name,
            message: 'Item not found in inventory'
          };
        }
        
        // Update inventory quantity
        inventoryItem.quantity += returnItem.quantity;
        await inventoryItem.save();
        
        return { 
          success: true, 
          item: returnItem.name,
          returnedQuantity: returnItem.quantity,
          newInventoryQuantity: inventoryItem.quantity
        };
      })
    );
    
    res.status(200).json({
      success: true,
      message: 'Items returned to inventory successfully',
      results: updateResults
    });
    
  } catch (error) {
    console.error('Error returning items to inventory:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to return items to inventory',
      error: error.message 
    });
  }
};