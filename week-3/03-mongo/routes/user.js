const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User,Course } = require('../db');

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    //Chuck if this user already exist or not.

    const userExist = await User.findOne({username:username});
    if(!userExist){
        await User.create({
            username,
            password
        });
    res.json({
        message: 'User created successfully.'
    })    
    }else{
        res.status(409).send('User already exist with this username.');
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const allCourse = await Course.find({});
    res.json({
        courses: allCourse
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.headers.username;
    const courseId = req.params.courseId;

    //function to log the course title
    const courseTitle = await Course.findOne({_id:courseId},'title');

    await User.updateOne({
        username: username
    },{
        "$push": {
            purchasedCourses: courseId
        }
    })
    res.json({
        message: "Purchase complete! :)",
        courseTiteIs: courseTitle.title
    })
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    })
    
    const course = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    },'title description')
    res.json({
        purchasedCourse: course
    })
});

module.exports = router