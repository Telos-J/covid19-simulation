import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const labels = []

const infected = {
    label: 'Infected',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [],
    fill: true,
    radius: 0,
    tension: 0.4
}

const susceptable = {
    label: 'Susceptable',
    backgroundColor: 'rgb(99, 255, 132)',
    borderColor: 'rgb(99, 255, 132)',
    data: [],
    fill: true,
    radius: 0,
    tension: 0.4
}

const data = {
    labels: labels,
    datasets: [infected, susceptable]
}

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        animation: false,
        aspectRatio: 16 / 9,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: 'Real-time data of Covid19 Simulation'
            },
        },
        scales: {
            x: {
                display: false,
                title: {
                    text: 'Time'
                }
            },
            y: {
                stacked: true,
                title: {
                    display: false,
                    text: 'Number of humans'
                },
                ticks: {
                    min: 0,
                    max: 100000,
                    callback: function(value) {
                        return `${Math.floor(value / 1000)}k`
                    }
                },
            }
        }
    }
}

const chart = new Chart(
    document.getElementById('chart'),
    config
)

let frame = 0
function updateChart(infectedNum, susceptableNum) {
    labels.push(frame++)
    infected.data.push(infectedNum)
    susceptable.data.push(susceptableNum)
}

setInterval(() => chart.update(), 100)
window.addEventListener('click', (e) => {
    const chartContainer = chart.canvas.parentNode
    const rect = chartContainer.getBoundingClientRect()
    if ((e.clientX < rect.x || e.clientY > rect.bottom) &&
        chartContainer.classList.contains('maximized')) {
        chartContainer.classList.remove('maximized')
        config.options.plugins.legend.display = false
        config.options.plugins.title.display = false
        config.options.scales.x.display = false
        config.options.scales.y.title.display = false
    }
    else if ((e.clientX > rect.x && e.clientY < rect.bottom) &&
        !chartContainer.classList.contains('maximized')) {
        chartContainer.classList.add('maximized')
        config.options.plugins.legend.display = true
        config.options.plugins.title.display = true
        config.options.scales.x.display = true
        config.options.scales.y.title.display = true
    }
})

export { updateChart }
