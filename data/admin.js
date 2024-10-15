import bcrypt from "bcryptjs";
import { ObjectId } from 'mongodb';
import { users } from "../config/mongoCollections.js";
import helper from '../helpers.js';
import {
    checkIsProperString,
    containsNumbers
} from './../helpers.js';
import { addProject, deleteProject as deleteProjectData, getProjectWithID, updateProject as updateProjectData } from "./projects.js";

// Project Management Functions

export const createProject = async (projectData) => {
    // Validate projectData
    const { title, description, startDate, endDate } = projectData;

    checkIsProperString(title, 'Project Title');
    checkIsProperString(description, 'Project Description');

    // Add the project using the addProject function from projects.js
    const newProject = await addProject(title, description, startDate, endDate);

    return newProject;
};

export const updateProject = async (projectId, updateData) => {
    projectId = await helper.checkId(projectId, 'Project ID');

    // Update the project using the updateProject function from projects.js
    const updatedProject = await updateProjectData({ projectId, ...updateData });

    return updatedProject;
};

export const deleteProject = async (projectId) => {
    projectId = await helper.checkId(projectId, 'Project ID');

    // Delete the project using the deleteProject function from projects.js
    const deletionSuccess = await deleteProjectData(projectId);
    if (!deletionSuccess) {
        throw `Could not delete project with id of ${projectId}`;
    }
    return true;
};

export const getProjectById = async (projectId) => {
    projectId = await helper.checkId(projectId, 'Project ID');

    const project = await getProjectWithID(projectId);
    return project;
};

// User Management Functions

function validateCredentials(username, password) {
    const numbers = '1234567890';
    for (let char of username) {
        if (numbers.includes(char)) {
            throw new Error(`${username} is not allowed to contain numbers.`);
        }
    }

    if (username.length < 5 || username.length > 10) {
        throw new Error(`${username} must be at least 5 characters long with a max of 10 characters.`);
    }

    let caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let special = '-=_+[]\\{}|;\':" ,./<>?~!@#$%^&*()\'';

    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
    }

    let numCheck = false,
        capsCheck = false,
        specialCheck = false;

    for (let char of password) {
        if (numbers.includes(char)) numCheck = true;
        if (caps.includes(char)) capsCheck = true;
        if (special.includes(char)) specialCheck = true;
    }

    if (!numCheck || !capsCheck || !specialCheck) {
        throw new Error('Password must contain at least one number, capital letter, AND special character.');
    }
}

function validateBio(bio) {
    if (bio.length > 250) {
        throw new Error('Bio must be up to 250 characters long.');
    }
}

function validateThemePreference(themePreference) {
    themePreference = themePreference.toLowerCase();

    if (themePreference !== "light" && themePreference !== "dark") {
        throw new Error("Theme preference must be either 'light' or 'dark'.");
    }
}

export const addUser = async (userData) => {
    const { firstName, lastName, username, password, bio, userLocation, themePreference, role } = userData;

    validateCredentials(username, password);
    validateBio(bio);
    validateThemePreference(themePreference);

    const firstNameValidated = checkIsProperString(firstName, "First Name", 2, 25);
    containsNumbers(firstNameValidated);

    const lastNameValidated = checkIsProperString(lastName, "Last Name", 2, 25);
    containsNumbers(lastNameValidated);

    const userLocationValidated = checkIsProperString(userLocation, "User Location");

    const roleLower = role.toLowerCase();
    if (!['admin', 'prof', 'student', 'super_student'].includes(roleLower)) {
        throw new Error('Invalid role');
    }

    const saltRounds = 3; // Increase for production
    const hash = await bcrypt.hash(password, saltRounds);
    const usersCollection = await users();

    const userCheck = await usersCollection.findOne({ username: username.toLowerCase() });
    if (userCheck) {
        throw new Error('This username has already been taken.');
    }

    const newUser = {
        firstName: firstNameValidated,
        lastName: lastNameValidated,
        username: username.toLowerCase(),
        password: hash,
        bio: bio,
        userLocation: userLocationValidated,
        themePreference: themePreference.toLowerCase(),
        role: roleLower,
        listedProjects: [],
        borrowedProjects: [],
        projectHistory: [],
        projectStatuses: [],
        wishList: []
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.insertedId) {
        throw new Error('New user insertion was not successful.');
    }

    return { userAdded: true };
};

export const updateUser = async (userId, updateData) => {
    userId = await helper.checkId(userId, 'User ID');
    const usersCollection = await users();

    const updatedUserData = {};

    if (updateData.firstName) {
        updatedUserData.firstName = checkIsProperString(updateData.firstName, 'First Name', 2, 25);
        containsNumbers(updatedUserData.firstName);
    }
    if (updateData.lastName) {
        updatedUserData.lastName = checkIsProperString(updateData.lastName, 'Last Name', 2, 25);
        containsNumbers(updatedUserData.lastName);
    }
    if (updateData.bio) {
        validateBio(updateData.bio);
        updatedUserData.bio = updateData.bio;
    }
    if (updateData.userLocation) {
        updatedUserData.userLocation = checkIsProperString(updateData.userLocation, 'User Location');
    }
    if (updateData.themePreference) {
        validateThemePreference(updateData.themePreference);
        updatedUserData.themePreference = updateData.themePreference.toLowerCase();
    }
    // Handle password update if necessary
    if (updateData.password) {
        validateCredentials(updateData.username || '', updateData.password);
        const saltRounds = 3; // Increase for production
        updatedUserData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const updateInfo = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updatedUserData }
    );
    if (!updateInfo.modifiedCount) {
        throw new Error('Could not update user successfully.');
    }

    return await getUserById(userId);
};

export const deleteUser = async (userId) => {
    userId = await helper.checkId(userId, 'User ID');
    const usersCollection = await users();
    const deletionInfo = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    if (!deletionInfo.deletedCount) {
        throw new Error(`Could not delete user with id of ${userId}`);
    }
    return true;
};

export const assignRole = async (userId, role) => {
    userId = await helper.checkId(userId, 'User ID');
    const roleLower = role.toLowerCase();

    if (!['admin', 'prof', 'student', 'super_student'].includes(roleLower)) {
        throw new Error('Invalid role');
    }

    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { role: roleLower } }
    );
    if (!updateInfo.modifiedCount) {
        throw new Error('Could not assign role successfully');
    }
    return true;
};

export const getUserById = async (userId) => {
    userId = await helper.checkId(userId, 'User ID');
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw new Error('No user with that ID');
    user._id = user._id.toString();
    return user;
};
