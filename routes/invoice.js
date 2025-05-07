const express = require('express');
// const { protect } = require('../middleware/userAuth');
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoicesByCustomer,
  updateInvoiceStatus,
  deleteInvoice
} = require('../controllers/invoice');

const router = express.Router();

// router.use(protect); // Uncomment if using authentication

// Create a new invoice
router.post('/', createInvoice);

// Get all invoices
router.get('/', getAllInvoices);

// Get invoice by ID
router.get('/:id', getInvoiceById);

// Get invoices by customer ID
router.get('/customer/:customerId', getInvoicesByCustomer);

// Update invoice status
router.put('/:id/status', updateInvoiceStatus);

// Delete invoice
router.delete('/:id', deleteInvoice);

module.exports = router;
