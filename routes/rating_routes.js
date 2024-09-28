// import express from 'express';
import helper from '../helpers.js';
import { Router } from 'express';
const router = Router();
// const router = express.Router();
import { addRating, getRatingsByTool, getRatingsByUser } from '../data/ratings.js';

router
    .route('/ratings')
    .get(async (req, res) => {
        try{
            res.render('ratings', {themePreference: 'dark', title: 'Ratings'});
        }
        catch (error) {
            console.log("rating route error");
            console.log(error);
            res.status(500).json({error: error.message})
        }
    })
    .post(async (req, res) => {
        try {
            // const ratingData = req.body;
            console.log("Rating Data:");
            console.log(req.body);
            req.body.userID = await helper.checkId(req.body.userID, 'User ID');
            req.body.toolID = await helper.checkId(req.body.toolID, 'Tool ID');
            if (isNaN(req.body.rating)) throw 'Error: Rating must be a number';
            if (req.body.rating < 0 || req.body.rating > 10) throw 'Error: Rating must be a number between 0 and 10';
            req.body.comment = await helper.checkString(req.body.comment, 'Comment');
            //ratingID, userID, toolID, rating, comment
            req.body.userID = await helper.checkId(req.body.userID, 'User ID');
            req.body.toolID = await helper.checkId(req.body.toolID, 'Tool ID');
            if (isNaN(req.body.rating)) throw 'Error: Rating must be a number';
            if (req.body.rating < 0 || req.body.rating > 10) throw 'Error: Rating must be a number between 0 and 10';
            req.body.comment = await helper.checkString(req.body.comment, 'Comment');
            const ratingData = {
                userID: req.body.userID,
                toolID: req.body.toolID,
                rating: req.body.rating,
                comment: req.body.comment
            };
            console.log("RatingData:");
            console.log(ratingData);
            let rating = await addRating(ratingData); // req.body.something i think
            console.log("Rating: output");
            console.log(rating);
            // res.status().json(rating);
            if (rating.acknowledged) {
                return res.redirect('/login');
            }
        } catch (error) {
            console.log("rating route error");
            console.log(error);
            res.status(500).json({error: error.message})
        }
    })


// router
//     .route('/ratings/tool/:toolID')
//     .get(async (req, res) => {
//         try {
//             let toolParameter = req.params.toolID;
//             toolParameter = await helper.checkId(toolParameter, 'Tool ID');
//             let ratings = await getRatingsByTool(toolParameter);
//             // not sure what to do here, maybe req.json(ratings)
//         }
//         catch (error) {
//             res.status(500).json({error: error.message})
//         }
//     })

export default router;
