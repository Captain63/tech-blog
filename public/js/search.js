// Search bar logic

// Tag search bar
const searchBar = document.querySelector("#search-bar");

// Create array of all post containers
const searchArray = Array.from(document.querySelectorAll(".search-container"));

for (let i = 0; i < searchArray.length; i++) {
    // Creates empty strings property to hold retrieved values from fields
    searchArray[i].strings = [];

    const searchTerms = searchArray[i].querySelectorAll(".search-content");

    searchTerms.forEach(term => {
        const string = term.innerText.toLowerCase();

        searchArray[i].strings.push(string);
    })

    // Combines individual strings into combined searchString value for each record for easy referencing under displayResults
    searchArray[i].searchString = searchArray[i].strings.join(" ");
}

// Function for filtering out non-matching results on page
const displayResults = (array, query) => {
    // Finds post content that matches
    const matchArray = array.filter(item => item.searchString.includes(query));

    // Finds post content that doesn't match
    const noMatchArray = array.filter(item => !item.searchString.includes(query));

    // Displays those that match
    matchArray.forEach(item => {
        item.classList.add("show");
        item.classList.remove("hide");
    })

    // Hides those that don't match
    noMatchArray.forEach(item => {
        item.classList.add("hide");
        item.classList.remove("show");
    })
}

const searchQuery = ({ target }) => {
    displayResults(searchArray, target.value.toLowerCase());
}

// Assigns event listener each time key is entered into input
searchBar.addEventListener("input", searchQuery);