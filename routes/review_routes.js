import express from 'express';
import helper from '../helpers.js';
// import { Router } from 'express';
// const router = Router();
const router = express.Router();

router
    .route('/review/:id')
    .get(async (req, res) => {
        try {
            res.render('ratings', {theme: req.session.user.themePreference});
        } catch (error) {
            console.log("review route has an error");
            console.log(error);
            res.status(500).json({error: error.message});
        }
    })
    .post(async (req, res) => {
        try{
            let rating = req.body.rating
            let review = req.body.review
            
            let tools=await searchTools(search,condition)
            res.json({success: true, tools: tools, search: search});
        }catch(e){
            res.json({success: false, error: e});
        }
    });