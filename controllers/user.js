
// const User = require('../model/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const upload = require('../middleware/fileUpload'); 

// // Register middleware for handling multipart form data with file uploads
// const handleFileUploads = upload.fields([
//   { name: 'logo', maxCount: 1 },
//   { name: 'signature', maxCount: 1 }
// ]);

// // REGISTER USER
// const registerUser = async (req, res) => {
//   try {
//     const { 
//       // Company Info
//       companyName,
//       companyPhoneNo,
//       companyEmail,
//       // Address Info
//       billingAddress,
//       state,
//       city,
//       pincode,
//       // GST Info
//       isGstRegistered,
//       gstin,
//       panNumber,
//       enableEInvoice,
//       // Login Info
//       password,
//       // Business Info
//       businessType,
//       industryType,
//       businessRegistrationType,
//       // Terms and Signature
//       termsAccepted
//     } = req.body;

//     // Validation checks
//     if (!companyName || !companyPhoneNo || !companyEmail || !billingAddress || 
//         !state || !city || !pincode || !password || 
//         !businessType || !industryType || !businessRegistrationType || !panNumber) {
//       return res.status(400).json({ message: 'Please fill all required fields' });
//     }

//     // Check if email already exists
//     console.log("Checking for existing email:", companyEmail);
//     const userExists = await User.findOne({ companyEmail });
//     if (userExists) {
//       return res.status(400).json({ message: 'Company email already registered' });
//     }

//     // GST validation
//     if (isGstRegistered && !gstin) {
//       return res.status(400).json({ message: 'GSTIN is required for GST registered businesses' });
//     }

//     // Terms and conditions validation
//     if (!termsAccepted) {
//       return res.status(400).json({ message: 'You must accept the terms and conditions' });
//     }

//     // Get file paths from the upload middleware
//     let logoPath = null;
//     let signaturePath = null;
    
//     if (req.files) {
//       if (req.files.logo && req.files.logo[0]) {
//         logoPath = req.files.logo[0].path;
//       }
      
//       if (req.files.signature && req.files.signature[0]) {
//         signaturePath = req.files.signature[0].path;
//       }
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user with file paths
//     const user = await User.create({
//       companyName,
//       companyPhoneNo,
//       companyEmail,
//       billingAddress,
//       state,
//       city,
//       pincode,
//       isGstRegistered,
//       gstin,
//       panNumber,
//       enableEInvoice,
//       password: hashedPassword,
//       businessType,
//       industryType,
//       businessRegistrationType,
//       termsAccepted,
//       logo: logoPath,
//       signature: signaturePath
//     });

//     if (user) {
//       return res.status(201).json({
//         _id: user._id,
//         companyName: user.companyName,
//         companyEmail: user.companyEmail,
//         token: generateToken(user._id),
//       });
//     } else {
//       return res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (err) {
//     console.error(err);

//     if (err.code === 11000) {
//       return res.status(400).json({
//         message: `${Object.keys(err.keyPattern)[0]} already exists`,
//       });
//     }

//     if (err.name === 'ValidationError') {
//       return res.status(400).json({
//         message: Object.values(err.errors).map(val => val.message).join(', '),
//       });
//     }

//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // LOGIN USER
// const loginUser = async (req, res) => {
//   try {
//     const { companyEmail, password } = req.body;

//     const user = await User.findOne({ companyEmail });
//     if (user && (await bcrypt.compare(password, user.password))) {
//       return res.json({
//         _id: user._id,
//         companyName: user.companyName,
//         companyEmail: user.companyEmail,
//         token: generateToken(user._id),
//       });
//     } else {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // LOGOUT USER
// const logoutUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     // Optional: Handle logout logic if needed
//     return res.status(200).json({ message: 'User logged out successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // GET USER
// const getUser = async (req, res) => {
//   try {
//     // Using authorization header instead of req.body
//     const userId = req.user._id;
    
//     const user = await User.findById(userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.json({
//       message: 'User found',
//       user
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // GENERATE JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// module.exports = {
//   registerUser,
//   handleFileUploads,
//   loginUser,
//   logoutUser,
//   getUser,
// };


const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const upload = require('../middleware/fileUpload');
const fs = require('fs');
const path = require('path');

// Register middleware for handling multipart form data with file uploads
const handleFileUploads = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]);

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { 
      // Company Info
      companyName,
      companyPhoneNo,
      companyEmail,
      // Address Info
      billingAddress,
      state,
      city,
      pincode,
      // GST Info
      isGstRegistered,
      gstin,
      panNumber,
      enableEInvoice,
      // Login Info
      password,
      // Business Info
      businessType,
      industryType,
      businessRegistrationType,
      // Terms and Signature
      termsAccepted
    } = req.body;

    // Validation checks
    if (!companyName || !companyPhoneNo || !companyEmail || !billingAddress || 
        !state || !city || !pincode || !password || 
        !businessType || !industryType || !businessRegistrationType || !panNumber) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if email already exists
    console.log("Checking for existing email:", companyEmail);
    const userExists = await User.findOne({ companyEmail });
    if (userExists) {
      return res.status(400).json({ message: 'Company email already registered' });
    }

    // GST validation
    if (isGstRegistered && !gstin) {
      return res.status(400).json({ message: 'GSTIN is required for GST registered businesses' });
    }

    // Terms and conditions validation
    if (!termsAccepted) {
      return res.status(400).json({ message: 'You must accept the terms and conditions' });
    }

    // Get file paths from the upload middleware
    let logoPath = null;
    let signaturePath = null;
    
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        logoPath = req.files.logo[0].path;
      }
      
      if (req.files.signature && req.files.signature[0]) {
        signaturePath = req.files.signature[0].path;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with file paths
    const user = await User.create({
      companyName,
      companyPhoneNo,
      companyEmail,
      billingAddress,
      state,
      city,
      pincode,
      isGstRegistered,
      gstin,
      panNumber,
      enableEInvoice,
      password: hashedPassword,
      businessType,
      industryType,
      businessRegistrationType,
      termsAccepted,
      logo: logoPath,
      signature: signaturePath
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        companyName: user.companyName,
        companyEmail: user.companyEmail,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: `${Object.keys(err.keyPattern)[0]} already exists`,
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(err.errors).map(val => val.message).join(', '),
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { companyEmail, password } = req.body;

    const user = await User.findOne({ companyEmail });
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        _id: user._id,
        companyName: user.companyName,
        companyEmail: user.companyEmail,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGOUT USER
const logoutUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Optional: Handle logout logic if needed
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET USER
const getUser = async (req, res) => {
  try {
    // Using authorization header instead of req.body
    const userId = req.user._id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'User found',
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE USER PROFILE
const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update fields
    const updateFields = {
      companyName: req.body.companyName || user.companyName,
      companyPhoneNo: req.body.companyPhoneNo || user.companyPhoneNo,
      companyEmail: req.body.companyEmail || user.companyEmail,
      billingAddress: req.body.billingAddress || user.billingAddress,
      state: req.body.state || user.state,
      city: req.body.city || user.city,
      pincode: req.body.pincode || user.pincode,
      isGstRegistered: req.body.isGstRegistered !== undefined ? req.body.isGstRegistered : user.isGstRegistered,
      panNumber: req.body.panNumber || user.panNumber,
      enableEInvoice: req.body.enableEInvoice !== undefined ? req.body.enableEInvoice : user.enableEInvoice,
      businessType: req.body.businessType || user.businessType,
      industryType: req.body.industryType || user.industryType,
      businessRegistrationType: req.body.businessRegistrationType || user.businessRegistrationType,
      terms: req.body.terms || user.terms
    };

    // Only update GST number if the user is GST registered
    if (updateFields.isGstRegistered) {
      // If GST registered and no GSTIN provided, return error
      if (!req.body.gstin && !user.gstin) {
        return res.status(400).json({ message: 'GSTIN is required for GST registered businesses' });
      }
      updateFields.gstin = req.body.gstin || user.gstin;
    } else {
      // If not GST registered, set GSTIN to null
      updateFields.gstin = null;
    }

    // Handle password update
    if (req.body.password) {
      updateFields.password = await bcrypt.hash(req.body.password, 10);
    }

    // Handle file uploads - Logo
    if (req.files && req.files.logo && req.files.logo[0]) {
      // Delete the old logo file if exists
      if (user.logo) {
        try {
          fs.unlinkSync(path.join(process.cwd(), user.logo));
        } catch (err) {
          console.error('Failed to delete old logo:', err);
        }
      }
      updateFields.logo = req.files.logo[0].path;
    } else if (req.body.removeLogo === 'true') {
      // Remove logo if requested
      if (user.logo) {
        try {
          fs.unlinkSync(path.join(process.cwd(), user.logo));
        } catch (err) {
          console.error('Failed to delete logo:', err);
        }
      }
      updateFields.logo = null;
    }

    // Handle file uploads - Signature
    if (req.files && req.files.signature && req.files.signature[0]) {
      // Delete the old signature file if exists
      if (user.signature) {
        try {
          fs.unlinkSync(path.join(process.cwd(), user.signature));
        } catch (err) {
          console.error('Failed to delete old signature:', err);
        }
      }
      updateFields.signature = req.files.signature[0].path;
    } else if (req.body.removeSignature === 'true') {
      // Remove signature if requested
      if (user.signature) {
        try {
          fs.unlinkSync(path.join(process.cwd(), user.signature));
        } catch (err) {
          console.error('Failed to delete signature:', err);
        }
      }
      updateFields.signature = null;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    
    if (err.code === 11000) {
      return res.status(400).json({
        message: `${Object.keys(err.keyPattern)[0]} already exists`,
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(err.errors).map(val => val.message).join(', '),
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// GENERATE JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  handleFileUploads,
  loginUser,
  logoutUser,
  getUser,
  updateUser
};