import { ObjectId } from 'mongodb';
import { projects, users } from "../config/mongoCollections.js";
import helper from '../helpers.js';

// Add a new project
export const addProject = async (title, description, startDate, endDate) => {
    title = await helper.checkString(title, 'Project Title');
    description = await helper.checkString(description, 'Project Description');
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw 'Error: Invalid date format.';
    }
    if (endDate < startDate) {
        throw 'Error: End date must be after start date.';
    }

    const projectsCollection = await projects();
    const newProject = {
        title,
        description,
        startDate,
        endDate,
        createdAt: new Date(),
    };

    const insertInfo = await projectsCollection.insertOne(newProject);
    if (!insertInfo.insertedId) throw 'Error: Could not add project';

    return await getProjectWithID(insertInfo.insertedId.toString());
};

// Get all projects
export const getAllProjects = async () => {
    const projectsCollection = await projects();
    const projectList = await projectsCollection.find({}).toArray();
    return projectList.map(project => {
        project._id = project._id.toString();
        return project;
    });
};

// Search projects by title or description
export const searchProjects = async (searchTerm) => {
    searchTerm = await helper.checkString(searchTerm, 'Search Term');
    const projectsCollection = await projects();
    const regex = new RegExp(searchTerm, 'i');
    const projectsFound = await projectsCollection.find({
        $or: [{ title: regex }, { description: regex }]
    }).toArray();

    return projectsFound.map(project => {
        project._id = project._id.toString();
        return project;
    });
};

// Filter projects by tags
export const filterProjectsByTags = async (tags) => {
    if (!Array.isArray(tags)) {
        throw 'Error: Tags must be an array';
    }
    const projectsCollection = await projects();
    const projectsFound = await projectsCollection.find({
        tags: { $in: tags }
    }).toArray();

    return projectsFound.map(project => {
        project._id = project._id.toString();
        return project;
    });
};

// Get project by ID
export const getProjectWithID = async (id) => {
    id = await helper.checkId(id, 'Project ID');
    const projectsCollection = await projects();
    let project = await projectsCollection.findOne({ _id: new ObjectId(id) });
    if (!project) throw 'Error: Project not found';
    project._id = project._id.toString();
    return project;
};

// Get projects by user ID
export const getProjectsByUserID = async (userID) => {
    userID = await helper.checkId(userID, 'User ID');
    const projectsCollection = await projects();
    const projectsFound = await projectsCollection.find({ userID: new ObjectId(userID) }).toArray();

    return projectsFound.map(project => {
        project._id = project._id.toString();
        return project;
    });
};

// Get projects by name
export const getProjectWithName = async (projectName) => {
    projectName = await helper.checkString(projectName, 'Project Name');
    const projectsCollection = await projects();
    const regex = new RegExp(`^${projectName}$`, 'i');
    const project = await projectsCollection.findOne({ title: regex });
    if (!project) throw 'Error: Project not found';
    project._id = project._id.toString();
    return project;
};

// Update a project
export const updateProject = async ({ projectId, title, description, startDate, endDate }) => {
    projectId = await helper.checkId(projectId, 'Project ID');
    const updatedProject = {};

    if (title) {
        updatedProject.title = await helper.checkString(title, 'Project Title');
    }
    if (description) {
        updatedProject.description = await helper.checkString(description, 'Project Description');
    }
    if (startDate) {
        startDate = new Date(startDate);
        if (isNaN(startDate.getTime())) throw 'Error: Invalid start date format.';
        updatedProject.startDate = startDate;
    }
    if (endDate) {
        endDate = new Date(endDate);
        if (isNaN(endDate.getTime())) throw 'Error: Invalid end date format.';
        updatedProject.endDate = endDate;
    }
    if (startDate && endDate && endDate < startDate) {
        throw 'Error: End date must be after start date.';
    }

    const projectsCollection = await projects();
    const updateInfo = await projectsCollection.updateOne(
        { _id: new ObjectId(projectId) },
        { $set: updatedProject }
    );
    if (!updateInfo.modifiedCount) throw 'Error: Could not update project';

    return await getProjectWithID(projectId);
};

// Delete a project
export const deleteProject = async (projectId) => {
    projectId = await helper.checkId(projectId, 'Project ID');
    const projectsCollection = await projects();
    const deletionInfo = await projectsCollection.deleteOne({ _id: new ObjectId(projectId) });
    if (!deletionInfo.deletedCount) throw 'Error: Could not delete project';

    return true;
};

// Add project to wishlist
export const addWishlist = async (userID, projectID) => {
    userID = await helper.checkId(userID, 'User ID');
    projectID = await helper.checkId(projectID, 'Project ID');

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userID) });
    if (!user) throw `Error: User with ID ${userID} not found`;

    if (!user.wishList) {
        user.wishList = [];
    }

    if (user.wishList.length >= 3) {
        throw `Error: Wishlist already contains the maximum number of projects (3).`;
    }

    if (user.wishList.includes(projectID)) {
        throw `Error: Project with ID ${projectID} is already in the wishlist`;
    }

    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(userID) },
        { $addToSet: { wishList: projectID } }
    );

    if (!updateInfo.modifiedCount) {
        throw `Error: Could not add project with ID ${projectID} to the wishlist`;
    }

    return { success: true, message: `Project with ID ${projectID} added to wishlist successfully` };
};
