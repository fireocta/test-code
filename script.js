    async function checkSpoiler() {
        const review = document.getElementById("review").value;
        if (!review.trim()) {
            alert("Please enter a review!");
            return;
        }

        result.innerText = "Checking...";
        applyRandomization();
        
        try {
            const response = await fetch("http://localhost:8000/check_spoiler/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: review }),
            });

            const data = await response.json();
            document.getElementById("result").textContent = data.message;
            document.getElementById("result").style.color = data.message.includes("Non-") ? "lime" : "red";
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
        const response = await fetch("http://localhost:8000/search_movie/", {
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