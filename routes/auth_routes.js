import {registerUser, loginUser} from '../data/users.js';
import {addTool,getAllTools,getToolWithID} from '../data/tools.js';
import{      
    checkIsProperString,
    checkIsProperPassword,
    containsNumbers, 
} from './../helpers.js'
import helper from '../helpers.js';
import { Router } from 'express';
const router = Router();
//need to add session middleware
// router.route('/').get(async (req, res) => {
//     //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
//     return res.json({error: 'YOU SHOULD NOT BE HERE!'});
//   });

router.route('/register').get(async (req, res) => {
    //code here for GET
    try{
        return res.render('register', {themePreference: 'dark', title: 'Register'});
    } catch (e) {
        return res.status(500).json({registerpagegeterror: e});
    }
    })
    .post(async (req, res) => {
    //code here for POST
        let firstName= req.body.firstName
        let lastName=req.body.lastName
        let username=req.body.username
        let password=req.body.password
        let bio=req.body.bio
        let themePreference=req.body.themePreference
        let pronouns=req.body.pronouns
        let confirmPassword=req.body.confirmPassword
        let userLocation= req.body.userLocation
        
        try {
            firstName = await helper.checkString(firstName, "First Name");
            lastName = await helper.checkString(lastName, "Last Name");
            username = await helper.checkString(username, "Username");
            password = await helper.checkString(password, "Password");
            confirmPassword = await helper.checkString(confirmPassword, "Confirm Password");
            if (password !== confirmPassword) throw "Error: Password does not match confirmation password";
            bio = await helper.checkString(bio, "Bio");
            userLocation = await helper.checkString(userLocation, "Location");
            themePreference = await helper.checkString(themePreference, "Theme Preference");
            pronouns = await helper.checkString(pronouns, "Pronouns");
          } catch (e) {
            req.method='GET'
            return res.status(400).render('register',{hasErrors: true,error: e});
          }
        
          let register
        
          try {
            register = await registerUser(
              firstName,
              lastName,
              username,
              password,
              pronouns,
              bio, userLocation, themePreference
            );
        } catch (e) {
            req.method='GET'
            return res.status(400).render('register',{hasErrors: true,error: e});
        }
        
        if (register.signupCompleted){
            req.method='GET'
            return res.redirect('/login');
        } else {
            req.method='GET'
            return res.status(500).render('register',{hasErrors: true, error: "Internal Servive Error"});
        }
    });

router.route('/login').get(async (req, res) => {
    //code here for GET
    try {
        return res.render('login', {themePreference: 'light', title: 'Login'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: e});
    }
    })
    .post(async (req, res) => {
        //code here for POST
    const logindata = req.body;
    try {
        logindata.username = await helper.checkString(logindata.username, 'Username');
        logindata.password = await helper.checkString(logindata.password, 'Password');
        // console.log("Username:", logindata.Username);
        // console.log("Password:", logindata.Password);
    } catch (e) {
        return res.status(500).render('login', {hasErrors: true,error: e});
    }

    try {
        const user = await loginUser(logindata.username, logindata.password);
        // console.log("User:");
        // console.log(user);
        if (user){
            req.session.user=user
            console.log("User Logged In");
            return     res.redirect('/landing');
        } else {
            return res.status(500).render('login', {hasErrors: true,error: 'User not logged in'});
        }
    } catch (e) {
        return res.status(500).render('login', {hasErrors: true,error: e});
    }

    });

router.route('/landing').get(async (req, res) => {
    try {
        let tools=await getAllTools()
        tools.reverse();
        tools=tools.slice(0, Math.min(18, tools.length));
        return res.render('landing', {title: 'Home', tools: tools, themePreference: req.session.user.themePreference});
    } catch (e) {
        return res.status(500).json({error: e});
    }
});

router.route('/logout').get(async (req, res) => {
    req.session.destroy();
    res.render('logout');
  });

    export default router;
