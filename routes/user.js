// const express = require('express');
// const {
//     registerUser,
//     loginUser,
//     logoutUser,
//     getUser
// } = require('../controllers/user');

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/logout/:id', logoutUser);
// router.get('/getUser/', getUser);

// module.exports = router;



const express = require('express');
const {registerUser, loginUser, logoutUser, getUser, updateUser, handleFileUploads} = require('../controllers/user');
const { protect } = require('../middleware/userAuth');
const upload = require('../middleware/fileUpload');

const router = express.Router();

// Setup multer for file uploads
const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 }, 
  { name: 'signature', maxCount: 1 }
]);

// Routes
router.post('/register', uploadFields, registerUser);
router.post('/login', loginUser);
router.post('/logout/:id', logoutUser);
router.get('/profile', protect, getUser);
router.put('/update', protect, handleFileUploads, updateUser);

module.exports = router;