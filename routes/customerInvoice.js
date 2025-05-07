const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/customerInvoiceController');

// Get all invoices for a specific customer
router.get('/customer/:customerId', invoiceController.getCustomerInvoices);

// Add a new invoice for a customer
router.post('/customer/:customerId', invoiceController.addInvoice);

// Get invoice details by ID
router.get('/:id', invoiceController.getInvoiceById);

// Update invoice status
router.patch('/:id/status', invoiceController.updateInvoiceStatus);

// Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;