const {PrismaClient} = require('@prisma/client');
const bcrypt =require('bcryptjs');
const config = require('../config/config');
const jwt= require('jsonwebtoken');
const {generateResetToken}= require('../utils/passwordReset');


const prisma = new PrismaClient();


exports.register = async(req,res)=>{
    try {
        const {name, email, password, role} = req.body;
        
        const existingUser = await prisma.user.findUnique({
            where:{email}
        })

        if(existingUser)
        {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }

        if(role !== 'SUPERVISOR' && role!== 'STAFF')
        {
            return res.status(400).json({ 
                success: false, 
                message: 'Role must be either SUPERVISOR or STAFF for registration' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
                role
            }
        });

        const token = jwt.sign(
            {id:user.id, role:user.role},
            config.jwtSecret,
            {expiresIn: config.jwtExpiresIn}
        )
        
        res.status(201).json({
            success:true,
            message: 'User registered successfully',
            data:{
                role:user.role,
                token
            }
        })

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
        success: false, 
        message: 'Server error during registration' 
        });
    }
}


exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      });
  
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );
      console.log("the role is ", user.role);
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          role: user.role,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during login' 
      });
    }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user with this email' });
    }

    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); 

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    console.log("Password reset link:", resetLink);

    res.json({
      success: true,
      message: 'Password reset link (mock) generated',
      resetLink, 
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      // fid user by token
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpires: {
            gte: new Date()
          }
        }
      });
  
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or expired password reset token' 
        });
      }
  
      // hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update user with new password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpires: null
        }
      });
  
      res.json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during password reset' 
      });
    }
};
  

// Get current user profile
exports.getCurrentUser = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
  
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
  
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error retrieving user profile' 
      });
    }
};