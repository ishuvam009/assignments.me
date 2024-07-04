const { Router } = require("express");
const { Admin,Course } = require("../db")
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require('jsonwebtoken')
const { jwtPassword } = require('../secret');

// Admin Routes
router.post('/signup', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // check if a user with this username already exists
    const adminExist = await Admin.findOne({username});
    if(!adminExist){
        await Admin.create({
            username: username,
            password: password
        })
    
        res.json({
            message: 'Admin created successfully :)'
        })
    } else{
        res.status(409).send('User already exist with this username.')
    }
});

//signin logic which retun a jwt token
router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const loginedAdmin = await Admin.findOne({username,password});

    if(loginedAdmin){
        const generateToken = jwt.sign({
            username,
        },jwtPassword);
        res.json({
            generateToken
        })
    }else{
        res.json({
            message: "Wrong ID and Password."
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;

    Course.create({
        title,
        description,
        imageLink,
        price
    });
    res.json({
        message: "Course Create Sucesfully."
    })

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
   const allCourses = await Course.find({});
   res.send(allCourses);
});

module.exports = router;