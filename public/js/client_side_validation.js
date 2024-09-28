// const toolregisterform = document.getElementById('tool-info');
// const userregisterform = document.getElementById('signup-form');
// const ratingform = document.getElementById('rating-info');
// const loginform = document.getElementById('signin-form');

// if (toolregisterform) {
//     console.log('toolregisterform');
//     toolregisterform.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const toolName = document.getElementById('toolName').value.trim();
//         const description = document.getElementById('description').value.trim();
//         const condition = document.getElementById('condition').value.trim();
//         const userID = document.getElementById('userID').value.trim();
//         const availability = document.getElementById('availability').value.trim();
//         const location = document.getElementById('location').value.trim();
//         // const images = document.getElementById('images').value;
//         let error = document.getElementById('toolregistererror');
//         error.innerHTML = '';
//         error.hidden = true;
//         if(!toolName || !description || !condition || !userID || !availability || !location){
//             error.innerHTML = 'All fields are required';
//             error.hidden = false;
//             return;
//         }
//         else if(toolName.length > 50){
//             error.innerHTML = 'Tool Name must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (description.length > 500){
//             error.innerHTML = 'Description must be less than 500 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (condition.length > 50){
//             error.innerHTML = 'Condition must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (userID.length > 50){
//             error.innerHTML = 'User ID must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (availability.length > 50){
//             error.innerHTML = 'Availability must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (location.length > 50){
//             error.innerHTML = 'Location must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else{
//             // toolregisterform.submit();
//             event.target.submit();
//         }
//     });
// }

// if(userregisterform){
//     console.log('userregisterform');
//     userregisterform.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const username = document.getElementById('username').value.trim();
//         const password = document.getElementById('password').value.trim();
//         const confirmPassword = document.getElementById('confirmPassword').value.trim();
//         const pronouns = document.getElementById('pronouns').value.trim();
//         const bio = document.getElementById('bio').value.trim();
//         const userLocation = document.getElementById('userLocation').value.trim();
//         const themePreference = document.getElementById('themePreference').value.trim();
//         let error = document.getElementById('userregistererror');
//         error.innerHTML = '';
//         error.hidden = true;
//         if(!username || !password || !confirmPassword || !pronouns || !bio || !userLocation || !themePreference){
//             error.innerHTML = 'All fields are required';
//             error.hidden = false;
//             return;
//         }
//         else if(username.length > 50){
//             error.innerHTML = 'Username must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (password.length > 50){
//             error.innerHTML = 'Password must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (confirmPassword.length > 50){
//             error.innerHTML = 'Confirm Password must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (pronouns.length > 50){
//             error.innerHTML = 'Pronouns must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (bio.length > 250){
//             error.innerHTML = 'Bio must be less than 250 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (userLocation.length > 50){
//             error.innerHTML = 'Location must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (themePreference.length > 50){
//             error.innerHTML = 'Theme Preference must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else{
//             // userregisterform.submit();
//             event.target.submit(); 
//         }
//     });
// }

// if(ratingform){
//     console.log('ratingform');
//     ratingform.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const userID = document.getElementById('userID').value.trim();
//         const toolID = document.getElementById('toolID').value.trim();
//         const rating = document.getElementById('rating').value.trim();
//         const comment = document.getElementById('comment').value.trim();
//         let error = document.getElementById('ratingregistererror');
//         error.innerHTML = '';
//         error.hidden = true;
//         if(!userID || !toolID || !rating || !comment){
//             error.innerHTML = 'All fields are required';
//             error.hidden = false;
//             return;
//         }
//         else if(userID.length > 50){
//             error.innerHTML = 'User ID must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (toolID.length > 50){
//             error.innerHTML = 'Tool ID must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (rating.length > 50){
//             error.innerHTML = 'Rating must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (comment.length > 500){
//             error.innerHTML = 'Comment must be less than 500 characters';
//             error.hidden = false;
//             return;
//         }
//         else{
//             // ratingform.submit();
//             event.target.submit(); 
//         }
//     });
// }

// if(loginform){
//     console.log('loginform');
//     loginform.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const username = document.getElementById('username').value.trim();
//         const password = document.getElementById('password').value.trim();
//         let error = document.getElementById('userloginerror');
//         error.textContent = "";
//         error.hidden = true;
//         if(!username || !password){
//             error.innerHTML = 'All fields are required';
//             error.hidden = false;
//             return;
//         }
//         else if(username.length > 50){
//             error.innerHTML = 'Username must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else if (password.length > 50){
//             error.innerHTML = 'Password must be less than 50 characters';
//             error.hidden = false;
//             return;
//         }
//         else{
//             // loginform.submit();
//             event.target.submit(); 
//         }
//     });
// }

let searchForm = $('#searchForm');
let searchInput = $('#search_term');
let condition = $('#condition');
searchForm.submit(function (event) {
    event.preventDefault();
    
    let search = searchInput.val();
    let con = condition.val();
    let toolSearchedPage=document.getElementById("toolsSearchedPage")
    let err=document.getElementById('error')
    err.hidden=true
    toolSearchedPage.hidden=true

    try {
        if (!search) {
            throw 'Search not provided.';
        }

        if (typeof search !== 'string') {
            throw 'Error: search must be a string';
        }

        if (search.trim().length === 0) {
            throw 'Error: search cannot be an empty string or just spaces';
        }

        search = search.trim();
        $.ajax({
            method: 'POST',
            url: `/tools`,
            data: { search: search , condition: con },
        }).then(function (responsePage1) {
            displayFunc(responsePage1)
        });
    }
    catch (e) {
        err.hidden=false
        toolSearchedPage.hidden=true
        err.textContent=e
    }

});

function displayFunc(responsePage1) {

    let toolSearched = document.getElementById('toolSearched');
    let listTools = document.getElementById('toolsDiv');
    let toolSearchedPage=document.getElementById('toolsSearchedPage')
    let err=document.getElementById('error')
    err.hidden=true
    toolSearchedPage.hidden=true
    if(responsePage1.success){
        err.hidden=true
        toolSearchedPage.hidden=false
    let tools=responsePage1.tools;
    toolSearched.textContent="You searched for: "+responsePage1.search
    let text=""
    for(let tool of tools){
        text=text+"    <a href='/tools/"+tool._id+"' class='toolLink'>\
    <article class='toolArt'>\
        <img class='toolImage' alt='"+tool.toolName+" image' src='public/uploads/"+tool.image+"'> <br> <h2>"+tool.toolName+"</h2> <br> <h3>"+tool.description+"</h3> <h4>condition: "+tool.condition+"</h4>\
    </article>\
    </a>"

    } 
    listTools.innerHTML=text
}
else{
    err.hidden=false
    toolSearchedPage.hidden=true
    err.textContent=responsePage1.error
}
    


}