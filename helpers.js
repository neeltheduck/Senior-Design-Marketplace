import {ObjectId} from 'mongodb';

const checkId = async (id, varName) => {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error: ${varName} must be a string`;
    id = id.trim();
    if (id.length === 0) throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
};

const checkString = async (str, varName) => {
    if (!str) throw `Error: You must provide a ${varName}`;
    if (typeof str !== 'string') throw `Error: ${varName} must be a string`;
    str = str.trim();
    if (str.length === 0) throw `Error: ${varName} cannot be an empty value`;

     if (varName === 'Tool Name') {
        if (str.search(/[0-9]/) !== -1) throw `Error: ${varName} cannot contain numbers`;
        if (str.length < 2 || str.length > 40) throw `Error: ${varName} must be between 2 and 40 characters long`;
    }
    
    if (varName === 'Description' && (str.length < 2 || str.length > 500)) throw `Error: ${varName} must be between 2 and 500 characters long`;

    if (varName === 'Username') {
        if (str.length < 5 || str.length > 10) throw `Error: ${varName} must be 5-10 characters long`;
        if (str.search(/[0-9]/) !== -1) throw `Error: ${varName} cannot contain numbers`;
    }

    if (varName === 'Location') {
        if (str.length < 2 || str.length > 100) throw `Error: ${varName} must be 2-100 characters long`;
    }

    if (varName === 'Password' || varName === 'Confirm Password') {
        if (str.length < 8) throw `Error: ${varName} must be at least 8 characters long`;
        if (str.search(/[A-Z]/) === -1 || str.search(/[0-9]/) === -1 || str.search(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/>~]/) === -1) throw `Error: ${varName} must contain at least one uppercase letter, one number, and one special character`;
    }

    if (varName == 'Pronouns' && (str.toLowerCase() !== 'he/him' && str.toLowerCase() !== 'she/her' && str.toLowerCase() !== 'they/them')) throw `Error: ${varName} must either be He/Him, She/Her, or They/Them`;
    if (varName === 'Bio' && (str.length < 20 || str.length > 255)) throw `Error: ${varName} must be 25-255 characters long`;
    if (varName === 'Theme Preference' && (str.toLowerCase() !== 'light' && str.toLowerCase() !== 'dark')) throw `Error: ${varName} must be either 'Light' or 'Dark'`;
    if ((varName === 'First Name' || varName === 'Last Name') && (str.length < 2 || str.length > 25)) throw `Error: ${varName} must be between 2-25 characters`;
    if (varName === 'Comment' && str.length < 10) throw `Error: ${varName} must be at least 10 characters`;
    if (varName === 'Status' && (str.toLowerCase() !== 'approved' && str.toLowerCase() !== 'declined' && str.toLowerCase() !== 'pending')) throw `Error: ${varName} must be either Approved, Declined, or Pending`;
    
    return str;
};

const checkDate = async (date, varName) => {
    if (!date) `Error: You must provide a ${varName}`;
    if (Object.prototype.toString.call(date) !== '[object Date]') throw `Error: ${varName} must be a Date`;
    const currentDate = new Date();
    if (date.getTime() < currentDate.getTime()) throw `Error: ${varName} must be a date after the current date`;
    return date;
};

function checkIsProperString(str, variableName, min, max, validValues) {
    if (!str) {
          throw `${variableName || 'String'} not provided`;
        }
  
    if (typeof str !== 'string') {
      throw `${variableName || 'Provided variable'} is not a string`;
    }
    str=str.trim()
    if (str.length === 0) {
      throw `${variableName || 'Provided string'} is empty`;
    }
    if(min){
        if (str.length < min) {
            throw `${variableName || 'Provided string'} needs to have a minimum of ${min} characters`;
        }
    }
    if(max){
        if (str.length>max) {
            throw `${variableName || 'Provided string'} needs to have a maximum of ${max} characters`;
        }
    }
    if(validValues){
        if(Array.isArray(validValues)){
            if(validValues.length>0){
                if(!validValues.includes(str)){
                    throw `${variableName || 'Provided string'} is not one of the valid values`;
                }
            }
        }
    }

    return str
  }

function containsNumbers(str, variableName) {
    const numbers = '1234567890';
    for (let j of str) {
        if (numbers.includes(j)) {
            throw `${variableName || 'Provided string'} cannot contain numbers`;
        }
    }
}

function checkIsProperPassword(str, variableName, min, max) {
    str=checkIsProperString(str, variableName, min, max)
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '1234567890';
    let upper=false;
    let num=false;
    let special=false;
    for (let j of str) {
        if (numbers.includes(j)) {
            num=true;
        }
        else if(alphabet.toUpperCase().includes(j)){
            upper=true;
        }
        else if(j===" "){
            throw `${variableName || 'Provided string'} cannot contain spaces`;
        }
        else if(!alphabet.includes(j)){
            special=true;
        }
    }
    if(!(upper && num && special)){
        throw `${variableName || 'Provided string'} is invalid, must contain at least one uppercase character, at least one number and at least one special character:`
    }

    return str
    }

export default {checkId, checkString, checkDate};
export {
    checkIsProperString,
    checkIsProperPassword,
    containsNumbers
  };
