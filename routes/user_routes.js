import express from 'express';
import {Router} from 'express';
const router = Router();
import {getUser, get, toolRequested} from '../data/users.js';
import helper from '../helpers.js';
import { getRatings } from '../data/ratings.js';
//import {authCheck} from app.js;


// getUser
router
.get('/:username', async (req, res) => {
    try {
        let currentUsername = req.params.username;
        let user = await getUser(currentUsername);

        if (!user){
            return res.status(404).send('Sorry! User not found.');
        }

        res.render('users', {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            pronouns: user.pronouns,
            bio: user.bio,
            userLocation: user.userLocation,
            themePreference: user.themePreference,
            listedTools: user.listedTools,
            borrowedTools: user.borrowedTools,
            reservationHistory: user.reservationHistory,
            tradeStatuses: user.tradeStatuses,
            wishList: user.wishList,
        });
    } catch (error) {
        res.status(500).send('Error: Internal Server Error.');
    }
})
.post('/:username', async (req, res) => {
    console.log(req.body);
    let lender_id = req.body.lender_id;
    let req_username = req.body.req_username;
    let tool_id = req.body.tool_id;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;
    let status = req.body.approval;
    try {
        lender_id = await helper.checkId(lender_id, 'User ID');
        req_username = await helper.checkString(req_username, 'Username');
        tool_id = await helper.checkId(tool_id, 'Tool ID');
        start_date = await helper.checkDate(new Date(start_date), 'Start Date');
        end_date = await helper.checkDate(new Date(end_date), 'End Date');
        status = await helper.checkString(status, 'Status');
        let result = await toolRequested(lender_id, req_username, tool_id, start_date, end_date, status);
        if (!result) return res.status.render('users', {hasErrors: true, error: 'Error: Could not accept/decline request'});
        let user = await get(lender_id);
        if (!user) return res.status(404).send('Error: User not found');
        let reviews=await getRatings(user._id.toString())
        for (let i=0; i<reviews.length; i++){
            let reviewer=await get(reviews[i].userID)
            reviews[i].userID= reviewer.firstName+" "+reviewer.lastName;
        }
        return res.render('users', {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            pronouns: user.pronouns,
            bio: user.bio,
            userLocation: user.userLocation,
            themePreference: user.themePreference,
            listedTools: user.listedTools,
            borrowedTools: user.borrowedTools,
            reservationHistory: user.reservationHistory,
            tradeStatuses: user.tradeStatuses,
            reviews: reviews,
            wishList: user.wishList,
        });
    } catch (e) {
        return res.status(500).render('users', {hasErrors: true, error: e});
    }
});

// updateUser, i think its post

// deleteUser

router.
delete('/delete/:username', async (req, res) => {
    try {
        let currentUsername = req.params.username;
        await deleteUser(currentUsername);

        req.logout();

        res.redirect("/login");
    } catch (error) {
        res.status(500).json({error: "Well, we failed to delete your account. Look's like you're stuck with us!"});
    }
});

export default router;

// create middleware for /users so that it redirects to /:username
