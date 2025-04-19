const jwt =require('jsonwebtoken');
const config = require('../config/config');
const {PrismaClient}=require('@prisma/client');

const prisma= new PrismaClient();


// AUthentication and authorization for users routes

exports.authenticate = async (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      console.log(token);
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
      }
  
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);
      console.log(decoded);
      
      // Find user by id from token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
  
      console.log(user);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
  
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };
      console.log("finishing");
      next();
    } catch (err) {
      res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};
  

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
         success: false,
         message: 'User not authenticated'
       });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    
    next();
  };
};


exports.checkUserOwnership = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id);
  
  // if user is AdMIN, allow access to any user data
  if (req.user.role === 'ADMIN') {
    return next();
  }
  
  // For supervisor and STAFF, only allow access to their own data
  if (req.user.id !== requestedUserId) {
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized to access this user data' 
    });
  }
  
  next();
};