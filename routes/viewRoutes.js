const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use();

router.get('/', authController.protect, viewsController.getHome);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);
router.get('/account', authController.protect, viewsController.getAccount);
router.get('/forgotPassword', authController.isLoggedIn, viewsController.forgotPassword);
router.get('/reset=:token',authController.isLoggedIn, viewsController.resetPassword);

router.post('/update-user-data', authController.protect, viewsController.updateUserData)

module.exports = router;
