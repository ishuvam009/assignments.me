const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require('jsonwebtoken');
const { User } = require('../db');
const jwtPassword = require("..");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const useranme = req.body.username;
    const password = req.body.password;

    //logic to find if a user exist with same username.
    const userExist = User.findOne({username});

    if(!userExist){
        await User.create({
            username,
            password
        });
        res.json({
            message: "User created sucefully."
        })
    }else{
        res.json({
            message: "User exist with same username."
        })
    }
    
});

router.post('/signin', (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const user = User.find({username,password})
    if(user){
        const token = jwt.sign({username},jwtPassword);
        res.json({
            token
        })
    }else{
        res.json({
            message: "User does not exist with this Id and Password."
        })
    }
});

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router