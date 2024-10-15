// Updated addProject function in projects.js

export const addProject = async (title, description, startDate, endDate, professorId) => {
    title = await helper.checkString(title, 'Project Title');
    description = await helper.checkString(description, 'Project Description');
    professorId = await helper.checkId(professorId, 'Professor ID');
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
      professorId, // Associate the project with the professor
    };
  
    const insertInfo = await projectsCollection.insertOne(newProject);
    if (!insertInfo.insertedId) throw 'Error: Could not add project';
  
    return await getProjectWithID(insertInfo.insertedId.toString());
  };
  