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
        
        // Show success message and reveal movie info
        moviecheck.textContent = "Movie found!";
        movieInfo.classList.remove("hidden");
  
    } catch (error) {
        console.error("Error fetching movie data:", error);
        moviecheck.textContent = "Error: Could not find movie information";
        movieInfo.classList.add("hidden");
    }
}