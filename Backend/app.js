const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const userController =require('./controllers/userController');
const cors =require('cors');

const app = express();

//defining inbuilt middlewares and cors 
app.use(cors());
app.use(express.json());


//routes
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);



//global error handling 
app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server error'
    });
})


//By deafult creating the Admin User 
const initializeApp = async () => {
    try {
      await userController.createAdminUser();
    } catch (error) {
      console.error('Error initializing application:', error);
    }
};

initializeApp();


module.exports = app;