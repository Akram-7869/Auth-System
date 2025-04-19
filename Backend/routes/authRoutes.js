const express = require('express');
const authController = require('../controllers/authController');
const {validateRegistration, validateLogin, validateForgotPassword, validateResetPassword }=require('../middleware/validationMiddleware');
const {authenticate} =require('../middleware/authMiddleware');


const router= express.Router();

//Here there is signup, login, forgot-password, and then reset-password and for the dashboard own profile

router.post('/register', validateRegistration, authController.register);

router.post('/login', validateLogin, authController.login);

router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

router.post('/reset-password/:token', validateResetPassword, authController.resetPassword);

router.get('/me',authenticate, authController.getCurrentUser);


module.exports= router;