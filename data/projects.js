// can base this off of tools.js in CTLS

import { ObjectId } from 'mongodb';
import { projects, users } from "../config/mongoCollections.js";
import helper from '../helpers.js';

// addProject
export const addProject = async (projectName, description, condition, userID, availability, location, image) => {};

// getProjects
export const getAllProjects = async () => {};

// searchProjects
export const searchProjects = async (search, condition) => {};

// filterCondition
export const filterProjectsByTags = async (projects, tags) => {
    let output = [];
    console.log(tags);
    
    for (let project of projects) {
        console.log(project);
        if (project.tags && project.tags.some(tag => tags.includes(tag))) {
            output.push(project);
        }
    }
    
    return output;
};

// getProjectWithID
export const getProjectWithID = async (id) => {
    id = await helper.checkId(id, 'Project ID');
    const projectsCollection = await projects();
    let project = await projectsCollection.findOne({_id: new ObjectId(id)});
    if (!project) throw 'Error: Project not found';
    return project;
};

// getProjectWithUserID ?

// getProjectByName
export const getProjectWithName = async (projectName) => {
    // projectName = await helper.checkString(projectName, 'Project Name');
    const projectsCollection = await projects();
    //find list that include the projectName 
    // let project = await projectsCollection.find({projectName: {$regex: projectName, $options: 'i'}}).toArray();
    if (!project) throw 'Error: Project not found';
    return project;
};

// updateProject
export const updateProject = async ({projectID, projectName, description, condition, userID, dateAdded, availability, location, image}) => {};

// deleteProject
export const deleteProject = async (projectID,userID) => {};

// addWishlist
export const addWishlist = async (userID, projectID) => {
    try {
        userID = await helper.checkId(userID, 'User ID');
        projectID = await helper.checkId(projectID, 'Project ID');

        let project = await getProjectWithID(projectID);

        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(userID) });
        if (!user) throw `Error: User with ID ${userID} not found`;

        if (!user.wishlist) {
            user.wishlist = [];
        }

        if (user.wishlist.length >= 3) {
            throw `Error: Wishlist already contains the maximum number of projects (3).`;
        }

        if (user.wishlist.includes(projectID)) {
            throw `Error: Project with ID ${projectID} is already in the wishlist`;
        }

        const updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(userID) },
            { $addToSet: { wishList: project } }
        );

        if (updateInfo.modifiedCount === 0) {
            throw `Error: Could not add project with ID ${projectID} to the wishlist`;
        }

        return { success: true, message: `Project with ID ${projectID} added to wishlist successfully` };
    } catch (error) {
        console.error("Error in addWishlist:", error);
        throw `Error: Could not add project to wishlist. ${error}`;
    }
};
