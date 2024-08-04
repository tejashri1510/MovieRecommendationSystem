const API_KEY = ''; // Replace with your OMDb API key

document.getElementById('searchButton').addEventListener('click', searchMovies);

async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    if (query === '') return;

    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;

    try {
        showLoading();
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        if (data.Response === "False") {
            showError(data.Error);
        } else {
            displayMovies(data.Search);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to fetch movies. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayMovies(movies) {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.dataset.id = movie.imdbID;

        const imageUrl = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300';
        movieDiv.innerHTML = `
            <img src="${imageUrl}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;

        moviesList.appendChild(movieDiv);
    });
}

document.getElementById('moviesList').addEventListener('click', function(event) {
    const movieElement = event.target.closest('.movie');
    if (!movieElement) return;

    const movieId = movieElement.dataset.id;
    if (!movieId) return;

    fetchMovieDetails(movieId);
});

async function fetchMovieDetails(movieId) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`;

    try {
        showLoading();
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        const movie = await response.json();
        if (movie.Response === "False") {
            showError(movie.Error);
        } else {
            displayMovieDetails(movie);
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        showError('Failed to fetch movie details. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayMovieDetails(movie) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${movie.Title}</h2>
            <p>${movie.Plot}</p>
            <p>Release Date: ${movie.Released}</p>
            <p>Rating: ${movie.imdbRating}</p>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
        }, 3000);
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading');
    loadingDiv.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}
