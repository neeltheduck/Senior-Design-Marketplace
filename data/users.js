import bcrypt from "bcryptjs";
import { ObjectId } from 'mongodb';
import { users } from "../config/mongoCollections.js";
import helper from '../helpers.js';
import {
    checkIsProperString,
    containsNumbers
} from './../helpers.js';
import { getProjectWithID } from "./projects.js";

function validateCredentials(username, password) {
    const numbers = '1234567890';
    for (let char of username) {
        if (numbers.includes(char)) {
            throw `Error: ${username} is not allowed to contain numbers.`;
        }
    }

    if (username.length < 5 || username.length > 10) {
        throw `Error: ${username} must be at least 5 characters long with a max of 10 characters.`;
    }

    username = username.toLowerCase();

    let caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let special = '-=_+[]\\{}|;\':" ,./<>?~!@#$%^&*()`\'';

    if (password.length < 8) {
        throw `Error: password must be at least 8 characters long.`;
    }

    let numCheck = false, capsCheck = false, specialCheck = false;

    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        if (numbers.includes(char)) {
            numCheck = true;
        }
        if (caps.includes(char)) {
            capsCheck = true;
        }
        if (special.includes(char)) {
            specialCheck = true;
        }
    }
    if (!numCheck || !capsCheck || !specialCheck) {
        throw 'Error: password must contain at least one number, capital letter, AND special character.';
    }
}

function validateBio(bio) {
    if (bio.length > 250) {
        throw `Error: Bio must be up to 250 characters long.`;
    }
}

function validateThemePreference(themePreference) {
    themePreference = themePreference.toLowerCase();

    if (themePreference !== "light" && themePreference !== "dark") {
        throw `Error: themePreference must be either 'light' or 'dark'.`;
    }
}

export const registerUser = async (firstName, lastName, username, password, bio, userLocation, themePreference) => {
    validateCredentials(username, password);
    validateBio(bio);
    validateThemePreference(themePreference);

    firstName = checkIsProperString(firstName, "First Name", 2, 25);
    containsNumbers(firstName);

    lastName = checkIsProperString(lastName, "Last Name", 2, 25);
    containsNumbers(lastName);

    userLocation = checkIsProperString(userLocation, "User Location");

    const saltRounds = 3; // Increase for production
    const hash = await bcrypt.hash(password, saltRounds);
    const collectionUser = await users();

    const userCheck = await collectionUser.findOne({ username: username.toLowerCase() });
    if (userCheck) {
        throw 'Error: this username has already been taken.';
    }

    const updatedFields = {
        firstName: firstName,
        lastName: lastName,
        username: username.toLowerCase(),
        password: hash,
        bio: bio,
        userLocation: userLocation,
        themePreference: themePreference.toLowerCase(),
        listedProjects: [],
        borrowedProjects: [],
        projectHistory: [],
        projectStatuses: [],
        wishList: []
        // role: role.toLowerCase()
    };

    const insertInfo = await collectionUser.insertOne(updatedFields);
    if (!insertInfo.insertedId) {
        throw 'Error: New user insertion was not successful.';
    } else {
        return { signupCompleted: true };
    }
};

export const loginUser = async (username, password) => {
    if (
        username === undefined ||
        !username ||
        password === undefined ||
        !password ||
        username.trim() === '' ||
        password.trim() === ''
    ) {
        throw 'Error: Both username and password must be supplied.';
    }

    if (username.length < 5 || username.length > 10) {
        throw 'Error: Username must be at least 5 characters long with a max of 10 characters.';
    }

    let numbers = '1234567890';
    let caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let special = '-=_+[]\\{}|;\':" ,./<>?~!@#$%^&*()`\'';

    if (password.length < 8) {
        throw 'Error: password must be at least 8 characters long.';
    }

    let numCheck = false,
        capsCheck = false,
        specialCheck = false;

    for (let char of password) {
        if (numbers.includes(char)) {
            numCheck = true;
        }
        if (caps.includes(char)) {
            capsCheck = true;
        }
        if (special.includes(char)) {
            specialCheck = true;
        }
    }
    if (!numCheck || !capsCheck || !specialCheck) {
        throw 'Error: password must contain at least one number, capital letter, AND special character.';
    }

    const collectionUser = await users();
    const userCheck = await collectionUser.findOne({ username: username.toLowerCase() });

    if (!userCheck) {
        throw 'Either the username or password is invalid';
    }

    const passwordCrypt = await bcrypt.compare(password, userCheck.password);
    if (!passwordCrypt) {
        throw 'Either the username or password is invalid';
    } else {
        delete userCheck.password;
        return userCheck;
    }
};

export const updateProject = async (userId, project) => {
    userId = await helper.checkId(userId, 'User ID');
    const userCollection = await users();
    let user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw 'Error: User not found';
    const updatedInfo = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { listedProjects: project } }
    );
    if (!updatedInfo.modifiedCount) {
        throw 'Could not add project successfully';
    }
};

export const get = async (id) => {
    checkIsProperString(id);
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (user === null) {
        throw 'No user with that id';
    }
    user._id = user._id.toString();
    return user;
};

export const getByUserName = async (username) => {
    username = await helper.checkString(username, 'Username');
    const collectionUser = await users();
    let user = await collectionUser.findOne({ username: username.toLowerCase() });
    if (!user) throw 'Error: User not found';
    return user;
};

export const getUser = async (username) => {
    username = await helper.checkString(username, 'Username');
    const collectionUser = await users();
    let user = await collectionUser.findOne({ username: username.toLowerCase() });
    if (!user) throw 'Error: User not found';
    return user;
};

export const projectRequested = async (lenderID, requesterUsername, projectID, start_date, end_date, newStatus) => {
    const userCollection = await users();
    lenderID = await helper.checkId(lenderID, 'User ID');
    let lender = await userCollection.findOne({ _id: new ObjectId(lenderID) });
    if (!lender) throw 'Error: Lending user not found';
    requesterUsername = await helper.checkString(requesterUsername, 'Username');
    let requester = await userCollection.findOne({ username: requesterUsername.toLowerCase() });
    if (!requester) throw 'Error: Requesting user not found';
    projectID = await helper.checkId(projectID, 'Project ID');
    newStatus = await helper.checkString(newStatus, 'Status');

    let project = await getProjectWithID(projectID);
    let updateInfo;

    if (newStatus === 'pending') {
        updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(lenderID) },
            {
                $addToSet: {
                    projectStatuses: {
                        project,
                        requester: requesterUsername,
                        start: start_date,
                        end: end_date,
                        status: newStatus
                    }
                }
            }
        );
        if (!updateInfo.modifiedCount) throw 'Error: Project could not be requested';
    } else if (newStatus === 'approved' || newStatus === 'declined') {
        let lenderData = await userCollection.findOne({ _id: new ObjectId(lenderID) });
        let projectStatuses = lenderData.projectStatuses;
        for (let i = 0; i < projectStatuses.length; i++) {
            if (projectStatuses[i].project._id.toString() === projectID) {
                projectStatuses[i].status = newStatus;
            }
        }
        updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(lenderID) },
            { $set: { projectStatuses: projectStatuses } }
        );
        if (!updateInfo.modifiedCount) throw 'Error: Project could not be accepted/declined';
        if (newStatus === 'approved') {
            updateInfo = await userCollection.updateOne(
                { username: requesterUsername.toLowerCase() },
                { $addToSet: { projectHistory: project } }
            );
            if (!updateInfo.modifiedCount) throw "Error: Project could not be added to requester's project history";
        }
    }

    return updateInfo;
};

export const addToWishlist = async (username, projectID) => {
    let userCollection = await users();
    username = await helper.checkString(username, 'Username');
    let user = await userCollection.findOne({ username: username.toLowerCase() });
    if (!user) throw 'Error: User not found';
    projectID = await helper.checkId(projectID, 'Project ID');
    let project = await getProjectWithID(projectID);

    if (user.wishList.length >= 3) {
        throw 'Error: Wishlist already contains the maximum number of projects (3).';
    }

    if (user.wishList.includes(projectID)) {
        throw `Error: Project with ID ${projectID} is already in the wishlist`;
    }

    let updateInfo = await userCollection.updateOne(
        { username: username.toLowerCase() },
        { $addToSet: { wishList: projectID } }
    );
    if (!updateInfo.modifiedCount) throw 'Error: Could not add project to wish list';
    return { success: true, message: `Project with ID ${projectID} added to wishlist successfully` };
};
