

// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./dataBase/db');
// const cors = require('cors');
// const userRoute = require('./routes/user');
// const itemRoute = require('./routes/item');
// // const invoiceRoutes = require('./routes/invoice');
// const addCustomerRoutes = require('./routes/addCustomerRoutes');
// const app = express();

// // Connect Database
// connectDB();

// // Middleware
// // app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // Routes
// app.use('/api/user', userRoute);
// app.use('/api/items', itemRoute);
// app.use('/api/customer', addCustomerRoutes);
// // app.use('/api/invoices', invoiceRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () =>
//     console.log(`Server running in mode on port ${PORT}`));




require('dotenv').config();
const express = require('express');
const connectDB = require('./dataBase/db');
const cors = require('cors');
const path = require('path');
const userRoute = require('./routes/user');
const itemRoute = require('./routes/item');
const addCustomerRoutes = require('./routes/addCustomerRoutes');
const inventoryItemRoute = require('./routes/inventoryItem')
const customerInvoiceRoutes = require('./routes/customerInvoice');
const invoiceRoute = require('./routes/invoice')
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create upload directories if they don't exist
const fs = require('fs');
const uploadDirs = ['uploads', 'uploads/logos', 'uploads/signatures'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Routes
app.use('/api/user', userRoute);
app.use('/api/items', itemRoute);
app.use('/api/customer', addCustomerRoutes);
app.use('/api/inventory', inventoryItemRoute);
app.use('/api/invoice', customerInvoiceRoutes);
app.use('/api/invoices', invoiceRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`));