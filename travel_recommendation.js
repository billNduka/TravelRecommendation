// grab the things we need from the page
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsDiv = document.getElementById("results");

// this will hold all the data from the json file
let travelData = null;

// get the data from the json file
fetch("travel_recommendation_api.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data); // check the console to see if the data shows up
    travelData = data;
  })
  .catch(function (error) {
    console.log("Something went wrong:", error);
  });

// show a list of places on the page
function showResults(places) {
  resultsDiv.innerHTML = "";

  if (places.length === 0) {
    resultsDiv.innerHTML = "<p>No results found. Try searching for beach, temple or country.</p>";
    return;
  }

  for (let i = 0; i < places.length; i++) {
    resultsDiv.innerHTML +=
      '<div class="card">' +
        '<img src="' + places[i].imageUrl + '">' +
        "<h2>" + places[i].name + "</h2>" +
        "<p>" + places[i].description + "</p>" +
      "</div>";
  }
}

// runs when the Search button is clicked
function search() {
  if (travelData === null) {
    alert("Data has not loaded yet, try again in a moment.");
    return;
  }

  // make everything lowercase so Beach, BEACH and beach all work
  const keyword = searchInput.value.toLowerCase().trim();
  let results = [];

  if (keyword === "") {
    resultsDiv.innerHTML = "<p>Please type something to search for.</p>";
    return;
  }

  if (keyword.includes("beach")) {
    // matches beach and beaches
    results = travelData.beaches;
  } else if (keyword.includes("temple")) {
    // matches temple and temples
    results = travelData.temples;
  } else if (keyword.includes("countr")) {
    // matches country and countries, so show the cities of every country
    for (let i = 0; i < travelData.countries.length; i++) {
      results = results.concat(travelData.countries[i].cities);
    }
  } else {
    // maybe they typed a country name like japan
    for (let i = 0; i < travelData.countries.length; i++) {
      if (travelData.countries[i].name.toLowerCase() === keyword) {
        results = travelData.countries[i].cities;
      }
    }
  }

  showResults(results);
}

// Runs for when the Clear button is clicked
function clearResults() {
  resultsDiv.innerHTML = "";
  searchInput.value = "";
}

searchBtn.addEventListener("click", search);
clearBtn.addEventListener("click", clearResults);
