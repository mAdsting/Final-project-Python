// script.js

// Get References to HTML Elements
const globalCasesSpan = document.getElementById('global-cases');
const globalDeathsSpan = document.getElementById('global-deaths');
const globalRecoveredSpan = document.getElementById('global-recovered');
const globalNewCasesSpan = document.getElementById('global-new-cases');

const countryNameSpan = document.getElementById('country-name');
const countryCasesSpan = document.getElementById('country-cases');
const countryDeathsSpan = document.getElementById('country-deaths');
const countryRecoveredSpan = document.getElementById('country-recovered');
const countryNewCasesSpan = document.getElementById('country-new-cases');

const countryInput = document.getElementById('country-input');
const searchButton = document.getElementById('search-button');

const chartCanvas = document.getElementById('myChart');

// Variables
let allCountriesData = null;
let globalData = null;
let myChart = null;

// Fetch Data
async function fetchCovidData() {
    const globalApiUrl = 'https://disease.sh/v3/covid-19/all';
    const countriesApiUrl = 'https://disease.sh/v3/covid-19/countries';

    try {
        const [globalResponse, countriesResponse] = await Promise.all([
            fetch(globalApiUrl),
            fetch(countriesApiUrl)
        ]);

        if (!globalResponse.ok || !countriesResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        globalData = await globalResponse.json();
        allCountriesData = await countriesResponse.json();

        displayGlobalStats();
        renderGlobalChart(); // Render the chart after data is fetched
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display Global Stats
function displayGlobalStats() {
    if (globalData) {
        globalCasesSpan.textContent = globalData.cases.toLocaleString();
        globalDeathsSpan.textContent = globalData.deaths.toLocaleString();
        globalRecoveredSpan.textContent = globalData.recovered.toLocaleString();
        globalNewCasesSpan.textContent = globalData.todayCases.toLocaleString();
    }
}

// Render Global Line Chart
function renderGlobalChart() {
    const ctx = document.getElementById('globalChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Total Cases', 'Deaths', 'Recovered', 'New Cases'], // Labels for the x-axis
            datasets: [{
                label: 'Global Statistics',
                data: [
                    globalData.cases,
                    globalData.deaths,
                    globalData.recovered,
                    globalData.todayCases
                ], // Data for the y-axis
                borderColor: '#007bff', // Line color
                backgroundColor: 'rgba(0, 123, 255, 0.2)', // Fill color under the line
                borderWidth: 2,
                tension: 0.4 // Smooth curve
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide the legend
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Metrics'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            }
        }
    });
}

// Display Country Data
function displayCountryData(countryName) {
    const countryData = allCountriesData.find(country =>
        country.country.toLowerCase() === countryName.toLowerCase()
    );

    if (countryData) {
        countryNameSpan.textContent = countryData.country;
        countryCasesSpan.textContent = countryData.cases.toLocaleString();
        countryDeathsSpan.textContent = countryData.deaths.toLocaleString();
        countryRecoveredSpan.textContent = countryData.recovered.toLocaleString();
        countryNewCasesSpan.textContent = countryData.todayCases.toLocaleString();
        renderCountryChart(countryData);
    } else {
        countryNameSpan.textContent = 'Country not found';
    }
}

// Render Chart
function renderCountryChart(countryData) {
    if (myChart) myChart.destroy();

    const ctx = chartCanvas.getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Cases', 'Deaths', 'Recovered', 'Active'],
            datasets: [{
                label: `Statistics for ${countryData.country}`,
                data: [countryData.cases, countryData.deaths, countryData.recovered, countryData.active],
                backgroundColor: ['#007bff', '#dc3545', '#28a745', '#ffc107']
            }]
        }
    });
}

// Event Listeners
searchButton.addEventListener('click', () => {
    const countryName = countryInput.value.trim();
    if (countryName) displayCountryData(countryName);
});

// Initial Call
fetchCovidData();