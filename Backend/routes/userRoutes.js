const express =require('express');
const { authenticate, authorize, checkUserOwnership } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router =express.Router();


// I created two user routes one is for admin and another for specific roles which is staff and supervisor

router.get('/all', authenticate, authorize("ADMIN"), userController.getAllUsers);

router.get('/:id', authenticate, checkUserOwnership, userController.getUserById);


module.exports =router;

