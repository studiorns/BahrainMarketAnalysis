// Bahrain Market Data
const bahrainData = {
    impressions: {
        '2024': [38.84, 24.28, 34.79, 7.52, 56.45, 54.16, 24.90, 27.86, 38.77, 76.05, 134.60, 0],
        '2025': [36.76, 56.96, 109.60, 130.03, 192.78, 140.05, 64.08, 64.08, 57.53, 173.94, 202.79, 223.20]
    },
    travelQueries: {
        '2020': [1.21, 2.34, 1.00, 0.54, 0.53, 0.69, 0.89, 0.81, 0.79, 0.83, 0.88, 0.93],
        '2021': [1.33, 0.85, 0.93, 0.84, 0.99, 1.55, 1.54, 2.14, 1.97, 2.30, 2.84, 2.82],
        '2022': [3.38, 3.88, 3.69, 4.56, 5.05, 5.71, 7.97, 6.57, 4.59, 5.54, 4.94, 5.77],
        '2023': [5.32, 4.80, 4.89, 5.82, 6.70, 8.07, 9.89, 7.81, 5.94, 5.72, 5.37, 6.52],
        '2024': [5.75, 5.24, 5.41, 6.24, 7.15, 7.72, 7.64, 6.49, 5.47, 4.88, 3.99, 4.58],
        '2025': {
            'moderate': [4.77, 3.49, 5.52, 5.89, 6.43, 6.95, 8.84, 8.11, 6.02, 5.37, 4.39, 4.01],
            'conservative': [4.77, 3.49, 5.25, 5.58, 6.08, 6.56, 8.36, 7.65, 5.73, 5.12, 4.19, 3.82],
            'ambitious': [4.77, 3.49, 5.79, 6.18, 6.75, 7.31, 9.30, 8.52, 6.32, 5.64, 4.61, 4.21]
        }
    },
    flightSearches: {
        '2023': [824, 715, 832, 1240, 1234, 1754, 1839, 1353, 1025, 856, 887, 1007],
        '2024': [1096, 1122, 1088, 1053, 1227, 1481, 1094, 627, 638, 599, 684, 950]
    },
    hotelGuests: {
        '2023': [1756, 1489, 1125, 1455, 1030, 2235, 4629, 5351, 1722, 1532, 1275, 2594],
        '2024': [2117, 1583, 790, 1491, 1688, 3372, 4599, 5400, 1652, 1604, 1253, 2219]
    },
    brandHealth: {
        awareness: { current: 92.47, target: 94.38 },
        consideration: { current: 48.84, target: 51.00 },
        intent: { current: 28.35, target: 30.00 }
    },
    marketCharacteristics: {
        avgStay: 2.7,
        bookingWindow: 25,
        growthForecast: 0.5,
        peakMonths: 'Jul & Aug'
    },
    growthRates: {
        conservative: -3.5,
        moderate: 0.5,
        ambitious: 4.5
    }
};

// Months labels
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Chart instances
let queriesChart, impressionsChart, flightsChart, hotelChart;

// Chart configuration
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false
    },
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 15,
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
                family: "'Inter', sans-serif",
                weight: 'bold',
                size: 13
            },
            bodyFont: {
                family: "'Inter', sans-serif",
                size: 13
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            usePointStyle: true,
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        if (context.parsed.y > 1000000) {
                            label += (context.parsed.y / 1000000).toFixed(1) + 'M';
                        } else if (context.parsed.y > 1000) {
                            label += (context.parsed.y / 1000).toFixed(1) + 'K';
                        } else {
                            label += context.parsed.y.toLocaleString();
                        }
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                }
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                }
            }
        }
    },
    elements: {
        line: {
            tension: 0.3
        },
        point: {
            radius: 3,
            hoverRadius: 6
        }
    },
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    }
};

// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    setupTabSwitching();
    setupScenarioButtons();
    setupPrintButton();
});

function initCharts() {
    // Travel Queries Chart
    const queriesCtx = document.getElementById('queries-chart').getContext('2d');
    queriesChart = new Chart(queriesCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2024 Actual',
                    data: bahrainData.travelQueries['2024'],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '2025 Moderate (+0.5%)',
                    data: bahrainData.travelQueries['2025']['moderate'],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Bahrain Travel Queries Forecast',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Travel Queries Index',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    }
                },
                x: {
                    ...chartConfig.scales.x,
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    }
                }
            }
        }
    });
    
    // Impressions Chart
    const impressionsCtx = document.getElementById('impressions-chart').getContext('2d');
    impressionsChart = new Chart(impressionsCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2024',
                    data: bahrainData.impressions['2024'],
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '2025 (Planned)',
                    data: bahrainData.impressions['2025'],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Bahrain Media Impressions',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Impressions (Millions)',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            if (value >= 1000) return (value).toFixed(1) + 'M';
                            if (value >= 100) return (value).toFixed(1) + 'K';
                            return value;
                        }
                    }
                },
                x: {
                    ...chartConfig.scales.x,
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    }
                }
            }
        }
    });
    
    // Flight Searches Chart
    const flightsCtx = document.getElementById('flights-chart').getContext('2d');
    flightsChart = new Chart(flightsCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2023',
                    data: bahrainData.flightSearches['2023'],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '2024',
                    data: bahrainData.flightSearches['2024'],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Bahrain Flight Searches',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Flight Searches',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    }
                },
                x: {
                    ...chartConfig.scales.x,
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    }
                }
            }
        }
    });
    
    // Hotel Guests Chart
    const hotelCtx = document.getElementById('hotel-chart').getContext('2d');
    hotelChart = new Chart(hotelCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2023',
                    data: bahrainData.hotelGuests['2023'],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '2024',
                    data: bahrainData.hotelGuests['2024'],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Bahrain Hotel Guests',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Hotel Guests',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    }
                },
                x: {
                    ...chartConfig.scales.x,
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 'bold',
                            size: 13
                        }
                    }
                }
            }
        }
    });
}

function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

function setupScenarioButtons() {
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    scenarioButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            scenarioButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart based on selected scenario
            updateQueriesChart(this.getAttribute('data-scenario'));
        });
    });
}

function updateQueriesChart(scenario) {
    // Clear existing datasets
    queriesChart.data.datasets = [];
    
    if (scenario === 'actual') {
        // Show 2023 and 2024 actual data
        queriesChart.data.datasets.push({
            label: '2023 Actual',
            data: bahrainData.travelQueries['2023'],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            fill: false
        });
        
        queriesChart.data.datasets.push({
            label: '2024 Actual',
            data: bahrainData.travelQueries['2024'],
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            borderWidth: 2,
            fill: false
        });
    } else {
        // Show 2024 actual and 2025 forecast for selected scenario
        queriesChart.data.datasets.push({
            label: '2024 Actual',
            data: bahrainData.travelQueries['2024'],
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            borderWidth: 2,
            fill: false
        });
        
        let growthLabel = '';
        let borderColor = 'rgba(75, 192, 192, 1)';
        let backgroundColor = 'rgba(75, 192, 192, 0.1)';
        
        switch(scenario) {
            case 'conservative':
                growthLabel = ' (-3.5%)';
                borderColor = 'rgba(255, 99, 132, 1)';
                backgroundColor = 'rgba(255, 99, 132, 0.1)';
                break;
            case 'moderate':
                growthLabel = ' (+0.5%)';
                borderColor = 'rgba(75, 192, 192, 1)';
                backgroundColor = 'rgba(75, 192, 192, 0.1)';
                break;
            case 'ambitious':
                growthLabel = ' (+4.5%)';
                borderColor = 'rgba(153, 102, 255, 1)';
                backgroundColor = 'rgba(153, 102, 255, 0.1)';
                break;
        }
        
        queriesChart.data.datasets.push({
            label: `2025 ${scenario.charAt(0).toUpperCase() + scenario.slice(1)}${growthLabel}`,
            data: bahrainData.travelQueries['2025'][scenario],
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            borderWidth: 2,
            fill: false
        });
    }
    
    // Update chart
    queriesChart.update();
}

function setupPrintButton() {
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // Export functionality would go here
            alert('Export functionality would be implemented here.');
        });
    }
}
