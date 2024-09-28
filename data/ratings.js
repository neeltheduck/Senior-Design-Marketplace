import { ratings } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import { dbConnection } from "../config/mongoConnection.js";
import helper from '../helpers.js';

export const addRating = async (userID, ratingID, rating, comment) => {
    try {
        // userID = await helper.checkId(userID, 'User ID');
        // ratingID = await helper.checkId(ratingID, 'Rating ID');
        // if (isNaN(rating)) throw 'Error: Rating must be a number';
        // if (rating < 0 || rating > 10) throw 'Error: Rating must be a number between 0 and 10';
        // comment = await helper.checkString(comment, 'Comment');
        // const ratingCollection = await ratings();
        const dateAdded = new Date().toLocaleDateString();
        const newRating = {userID, ratingID, rating, comment,dateAdded};
        const result = await ratingCollection.insertOne(newRating);

        if (!result.acknowledged || !result.insertedId) throw 'Error: Rating could not be inserted into database';
        return result.insertedId.toString();

    } catch (e) {
        console.log("Error in addRating:");
        console.log(e);
        throw `Error: Rating was not successfully added.`;
    }
}



export const getRatingsByTool = async (toolID) => {
    // to do
    // add validation condition for toolID
    toolID = await helper.checkId(toolID, 'Tool ID');
    const ratingCollection = await ratings();
    const toolratings = await ratingCollection.find({_id : new ObjectId(toolID)}).toArray();
    return toolratings;
}

export const getRatingsByUser = async (userID) => {
    // to do
    // add validation condition for userID
    userID = await helper.checkId(userID, 'User ID');
    const ratingCollection = await ratings();
    const userratings = await ratingCollection.find({_id : new ObjectId(userID)}).toArray();
    return userratings;
}


export const getRatings = async (ratingID) => {
    // to do
    // add validation condition for userID
    const ratingCollection = await ratings();
    const userratings = await ratingCollection.find({ratingID: ratingID}).toArray();
    return userratings;
}
// error checking
