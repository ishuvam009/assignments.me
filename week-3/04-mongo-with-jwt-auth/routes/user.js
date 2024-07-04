const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require('jsonwebtoken');
const { User, Course } = require('../db');
const { jwtPassword } = require('../secret');

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    //logic to find if a user exist with same username.
    const userExist = await User.findOne({username});

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

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({username,password})
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

router.get('/courses', userMiddleware,async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find({});
    res.json({
        courses
    })

});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.username;
    const courseId = req.params.courseId;

    
    try {
        const coursePurchase = await Course.findOne({_id:courseId},"title description");
        await User.updateOne(
            {username},
        {
            "$push": {
                purchasedCourses: courseId
        }
        });
        res.json({
            message: "Purchase Sucessful.",
            Course_Name: coursePurchase.title,
            Course_Details: coursePurchase.description

        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const username = await req.username;
    
    try {
        const user = await User.findOne({
            username
        });
    
        const course = await Course.find({
            _id: {
                "$in": user.purchasedCourses
            }
        },"title price description -_id");
        res.json({
            YourCourse: course
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});

module.exports = router