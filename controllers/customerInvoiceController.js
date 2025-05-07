const CustomerInvoice = require('../model/customerInvoice');
const Customer = require('../model/Customer');

// Get all invoices for a specific customer
exports.getCustomerInvoices = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    
    // Validate customerId
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
    
    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Get all invoices for this customer
    const invoices = await CustomerInvoice.find({ customerId });
    
    // Format the response to match the expected client format
    const formattedInvoices = invoices.map(invoice => {
      return {
        _id: invoice._id,
        invoiceNo: invoice.invoiceNo,
        date: new Date(invoice.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).replace(/ /g, '-'),
        itemsPurchased: `${invoice.items.length} Items`,
        amount: invoice.amount,
        status: invoice.status
      };
    });
    
    res.status(200).json(formattedInvoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new invoice for a customer
exports.addInvoice = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    
    // Validate customerId
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
    
    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Validate invoice data
    const { invoiceNo, date, items } = req.body;
    
    if (!invoiceNo) {
      return res.status(400).json({ error: 'Invoice number is required' });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }
    
    // Check if invoice number already exists
    const existingInvoice = await CustomerInvoice.findOne({ invoiceNo });
    if (existingInvoice) {
      return res.status(400).json({ error: 'Invoice number already exists' });
    }
    
    // Calculate total amount (double-check the calculation from client)
    const calculatedAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Create new invoice
    const newInvoice = new CustomerInvoice({
      customerId,
      invoiceNo,
      date: date || new Date(),
      items,
      amount: calculatedAmount
    });
    
    const savedInvoice = await newInvoice.save();
    
    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get invoice details by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await CustomerInvoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['paid', 'unpaid', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (paid, unpaid, or pending)' });
    }
    
    const updatedInvoice = await CustomerInvoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.status(200).json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await CustomerInvoice.findByIdAndDelete(req.params.id);
    
    if (!deletedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};