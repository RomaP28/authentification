const express = require('express');
const multer = require('multer');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const upload = multer({dest: 'public/img/users'});

const router = express.Router();

// Auth for user
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword',
    authController.protect,
    authController.updatePassword);

router.patch('/updateMe',
    authController.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe);

router.delete('/deleteMe',
    authController.protect,
    userController.deleteMe);

// Auth for admin (REST)
router.route('/')
    .get(authController.protect,                                // first check if user logged in
         authController.restrictTo('admin', 'user', 'moderator'),  // second check if user role have access
         userController.getAllUsers)                            // third provide access
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
