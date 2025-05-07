// // controllers/customerController.js
// const Customer = require('../model/Customer');

// // Add new customer
// exports.addCustomer = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     const newCustomer = new Customer(req.body);
//     const savedCustomer = await newCustomer.save();
//     res.status(201).json(savedCustomer);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Get all customers
// exports.getAllCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find();
//     res.status(200).json(customers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };






const Customer = require('../model/Customer');

// Add new customer
exports.addCustomer = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    
    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.status(200).json({ message: 'Customer deleted successfully', customerId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete multiple customers
exports.deleteMultipleCustomers = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No customer IDs provided' });
    }
    
    const result = await Customer.deleteMany({ _id: { $in: ids } });
    
    res.status(200).json({ 
      message: 'Customers deleted successfully', 
      count: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get customer remaining balance
exports.getCustomerBalance = async (req, res) => {
  try {
    const customerId = req.params.id;

    // Find customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Return only the remainingBalance
    res.status(200).json({ remainingBalance: customer.remainingBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update customer RemainingBalance
exports.updateBalance = async (req, res) => {
  try {
    const { email, balance } = req.body;
    
    if (!email || balance === undefined) {
      return res.status(400).json({ error: 'Email and balance are required' });
    }
    
    const customer = await Customer.findOne({ email });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customer.remainingBalance = balance;
    await customer.save();
    
    res.status(200).json({ message: 'Balance updated successfully', balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};