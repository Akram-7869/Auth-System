const { check, validationResult } = require("express-validator");


// Created only for authroutes using the express-validators

exports.validateRegistration = [

 check('name', "Name is Required").not().isEmpty(),
 check('email', "Please include a valid Email").isEmail(),
 check('password', "Password must be at least 6 characters").isLength({min:6}),
 check('role', 'Role must be either SUPERVISOR or STAFF')
  .isIn(['SUPERVISOR', 'STAFF']),
 (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({
            success:false,
            errors:errors.array()
        });
    }
    next();
 }
]


exports.validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


exports.validateForgotPassword = [
    check('email', 'Please include a valid email').isEmail(),
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
    }
];


exports.validateResetPassword = [
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    }
];


