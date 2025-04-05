async function checkSpoiler() {
        const review = document.getElementById("review").value;
        if (!review.trim()) {
            alert("Please enter a review!");
            return;
        }

        result.innerText = "Checking...";
        applyRandomization();
        
        try {
            const response = await fetch("http://127.0.0.1:8000/check_spoiler/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: review }),
            });

            const data = await response.json();
            document.getElementById("result").textContent = data.message;
            document.getElementById("result").style.color = data.message.includes("NON-") ? "lime" : "red";
            applyRandomization();

        } catch (error) {
            document.getElementById("result").textContent = "Error checking spoiler";
            document.getElementById("result").style.color = "red";
            applyRandomization();
        }
    }

async function searchMovie() {
    const title = document.getElementById("movieTitle").value;
    if (!title.trim()) {
        alert("Please enter a movie title!");
        return;
    }

    document.getElementById("movieResult").textContent = "Searching...";

    try {
        const response = await fetch("http://127.0.0.1:8000/search_movie/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title }),
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById("movieResult").textContent = JSON.stringify(data, null, 2);
        } else {
            document.getElementById("movieResult").textContent = "Movie not found";
        }
    } catch (error) {
        document.getElementById("movieResult").textContent = "Error searching movie";
    }
    
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let interval = null;

// Function for the hover/randomization effect
function applyRandomization() {
    const resultElement = document.getElementById("result");
    const finalText = resultElement.innerText;
    let iteration = 0;

    clearInterval(interval);

    interval = setInterval(() => {
        resultElement.innerText = finalText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return finalText[index];
                }

                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        if (iteration >= finalText.length) {
            clearInterval(interval);
        }

        iteration += 1 / 3; // Smooth transition
    }, 30); // Speed of animation
}

setInterval(() => {
    
}, 5000); // Randomize every 5 seconds


async function displayMovieInfo() {
    const title = document.getElementById("movieTitle").value;
    const moviecheck = document.getElementById("moviecheck");
    const movieInfo = document.getElementById("movieInfo");

    // Show loading status
    moviecheck.textContent = "Searching for movie...";
    movieInfo.classList.add("hidden");
  
    try {
        const response = await fetch("http://127.0.0.1:8000/search_movie/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title }),
        });
  
        if (!response.ok) {
            moviecheck.textContent = "Movie not found";
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const movieData = await response.json();
  
        // Update the HTML with the movie information
        document.getElementById("moviePoster").innerHTML = `<img src="${movieData.Poster}" alt="Movie Poster" style="max-width: 200px;">`;
        document.getElementById("title").textContent = movieData.Title;
        document.getElementById("year").textContent = `Year: ${movieData.Year}`;
        document.getElementById("rating").textContent=`Ratings: ${movieData.imdbRating}`;
        document.getElementById("genre").textContent=`Genre: ${movieData.Genre}`;
        document.getElementById("summary").textContent=`Summary: ${movieData.Plot}`;
        
        // Show success message and reveal movie info
        moviecheck.textContent = "Movie found!";
        movieInfo.classList.remove("hidden");
  
    } catch (error) {
        console.error("Error fetching movie data:", error);
        moviecheck.textContent = "Error: Could not find movie information";
        movieInfo.classList.add("hidden");
    }
}

let debounceTimer;

// Remove the input event listener and replace with button click handler
document.querySelector('button[onclick="searchMovie()"]').addEventListener('click', function() {
    const searchTerm = document.getElementById("movieTitle").value;
    
    if (searchTerm.length < 2) {
        alert("Please enter at least 2 characters");
        return;
    }

    fetchSuggestions(searchTerm);
});

async function fetchSuggestions(searchTerm) {
    try {
        const response = await fetch("http://127.0.0.1:8000/search_suggestions/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ search_term: searchTerm }),
        });

        if (!response.ok) throw new Error("Failed to fetch suggestions");
        
        const suggestions = await response.json();
        displaySuggestions(suggestions);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}

function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = "";

    suggestions.forEach(movie => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.textContent = `${movie.Title} (${movie.Year})`;
        div.onclick = () => {
            document.getElementById("movieTitle").value = movie.Title;
            suggestionsContainer.innerHTML = "";
            displayMovieInfo();
        };
        suggestionsContainer.appendChild(div);
    });
}

// Add click event listener to close suggestions when clicking outside
document.addEventListener("click", function(e) {
    const suggestionsContainer = document.getElementById("suggestions");
    const searchInput = document.getElementById("movieTitle");
    
    if (e.target !== searchInput && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.innerHTML = "";
    }
});