let moviesData = [];

// Carga los datos de la API
fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
        moviesData = data;
    })
    .catch(error => console.error('Error fetching data:', error));

// Esta función es para buscar las películas
document.getElementById('btnBuscar').addEventListener('click', searchMovies);

function searchMovies() {
    const searchInput = document.getElementById('inputBuscar').value.toLowerCase();
    const results = moviesData.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchInput);
        const genreMatch = movie.genres.some(genre => 
            typeof genre === 'string' && genre.toLowerCase().includes(searchInput)
        );
        const taglineMatch = movie.tagline.toLowerCase().includes(searchInput);
        const overviewMatch = movie.overview.toLowerCase().includes(searchInput);

        return titleMatch || genreMatch || taglineMatch || overviewMatch;
    });

    displayResults(results);
}

function displayResults(results) {
    const resultsContainer = document.getElementById('lista');
    resultsContainer.innerHTML = ''; 

    if (results.length === 0) {
        resultsContainer.innerHTML = '<li class="list-group-item text-muted">No se encontraron resultados.</li>';
        return;
    }

    results.forEach(movie => {
        const movieElement = document.createElement('li');
        movieElement.className = 'list-group-item d-flex justify-content-between align-items-start';
        movieElement.innerHTML = `
            <div>
                <h5>${movie.title}</h5>
                <p>${movie.tagline}</p>
                <div>${renderStars(movie.vote_average)}</div>
                <button class="btn btn-secondary" onclick="showMovieDetails(${movie.id})">Ver Detalles</button>
            </div>
        `;
        resultsContainer.appendChild(movieElement);
    });
}

function renderStars(voteAverage) {
    const stars = Math.round(voteAverage / 2); // Esto es para convertir de 10 a 5 estrellas
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="fa fa-star${i <= stars ? '' : '-o'}" style="color: orange;"></span>`;
    }
    return starsHtml;
}

// Esto es para que muestre los detalles de la película en el modal
function showMovieDetails(movieId) {
    const movie = moviesData.find(m => m.id === movieId);
    const movieDetailsBody = document.getElementById('movieDetailsBody');

    // Esto llena el contenido del modal que está en el html
    movieDetailsBody.innerHTML = `
        <h5>${movie.title}</h5>
        <p>${movie.overview}</p>
        <p><strong>Géneros:</strong> ${movie.genres.join(', ')}</p>
        <p><strong>Año:</strong> ${new Date(movie.release_date).getFullYear()}</p>
        <p><strong>Duración:</strong> ${movie.runtime} min</p>
        <p><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</p>
        <p><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</p>
    `;

    // Esto es para poder mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('movieDetailModal'));
    modal.show();
}
