const { Router } = require("express");
const { Admin } = require("../db")
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require('jsonwebtoken')
const jwtPassword = require('../index')

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
    const username = req.body.uaername;
    const password = req.body.password;

    const loginedAdmin = await Admin.find({username,password});

    if(loginedAdmin){
        const generateToken = jwt.sign({
            username
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

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;