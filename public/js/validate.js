const form = document.querySelector("form");
const inputFields = document.querySelectorAll("input");
const textAreas = document.querySelectorAll("textarea");
const submitButton = document.querySelector(".submit-button");

const validate = () => {
    let inputArray = [];

    // If the form includes textareas
    textAreas.length > 0 ? 
        // Combine textareas and regular inputs into one array
        inputArray = [...inputFields, ...textAreas]:
        inputArray = [...inputFields];
    
    // Filter out inputs/textareas that have content
    const filteredArray = inputArray.filter(field => field.value.trim().length > 0);

    // If the number of fields with content in the filtered array matches the total number of fields, enable the submit button
    filteredArray.length === inputArray.length ? 
        submitButton.removeAttribute("disabled") :
        // Otherwise, keep disabled. Also allows function to reflexively disable button if field has content deleted
        submitButton.setAttribute("disabled", "");
}



form.addEventListener("input", validate);