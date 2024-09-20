// This script will handle the group joining logic

const maxGroupSize = 6;
let groups = [
    { name: 'Group Alpha', members: [] },
    { name: 'Group Beta', members: [] },
    { name: 'Group Gamma', members: [] }
];

// Function to populate group dropdown and list
function populateGroups() {
    const groupSelection = document.getElementById('groupSelection');
    const groupList = document.getElementById('groupList');

    // Clear existing options and list items
    groupSelection.innerHTML = '';
    groupList.innerHTML = '';

    // Loop through groups and add to the dropdown and list
    groups.forEach((group, index) => {
        // Add option to select dropdown
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${group.name} (${group.members.length}/${maxGroupSize})`;
        groupSelection.appendChild(option);

        // Add group to list with members count
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${group.name}</span>: ${group.members.length} members`;
        groupList.appendChild(listItem);
    });
}

// Function to join a group
function joinGroup() {
    const studentName = document.getElementById('studentName').value;
    const studentEmail = document.getElementById('studentEmail').value;
    const selectedGroupIndex = document.getElementById('groupSelection').value;

    if (studentName && studentEmail) {
        const selectedGroup = groups[selectedGroupIndex];

        if (selectedGroup.members.length < maxGroupSize) {
            selectedGroup.members.push({ name: studentName, email: studentEmail });
            alert(`${studentName} has joined ${selectedGroup.name}`);
        } else {
            alert('This group is already full.');
        }

        // Clear form fields
        document.getElementById('studentName').value = '';
        document.getElementById('studentEmail').value = '';

        // Refresh the groups display
        populateGroups();
    } else {
        alert('Please fill out all fields.');
    }
}

// Initialize the page with groups on load
document.addEventListener('DOMContentLoaded', populateGroups);
