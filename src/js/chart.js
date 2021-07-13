import { Chart, registerables } from 'chart.js';
import { balls } from './ball'
Chart.register(...registerables);
Chart.defaults.color = '#fff'
Chart.defaults.font.family = 'Montserrat'
Chart.defaults.font.style = 'italic'

let labels = []

const infected = {
    label: 'Infected',
    backgroundColor: 'rgb(255, 99, 132)',
    borderWidth: 0,
    data: [],
    fill: true,
    radius: 0,
    tension: 0.4
}

const susceptable = {
    label: 'Susceptable',
    backgroundColor: 'rgb(99, 255, 132)',
    borderWidth: 0,
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
        //aspectRatio: 4 / 3,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            },
            title: {
                display: true,
                padding: 20,
                text: 'Real-time data of Covid19 Simulation'
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: false,
                    text: 'Time'
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Number of humans'
                },
                ticks: {
                    callback: function(value) {
                        return value < 1000 ? value : `${Math.floor(value / 1000)}k`
                    }
                },
            }
        },
        layout: {
            padding: 20
        }
    }
}

let chart = new Chart(
    document.getElementById('chart'),
    config
)

let frame = 0
let finished = false
function updateChart() {
    let infectedNum = 0, susceptableNum = 0;
    for (let ball of balls.children) {
        if (ball.infected) infectedNum++
        else susceptableNum++
    }
    if (!finished) {
        labels.push(frame++)
        infected.data.push(infectedNum)
        susceptable.data.push(susceptableNum)
    }
    if (!susceptableNum) finished = true
}

function resetChart() {
    frame = 0
    labels.length = 0
    infected.data.length = 0
    susceptable.data.length = 0
}

setInterval(() => chart.update(), 100)

{ // UI/UX stuff
    const chartIcon = document.querySelector('#chart-icon')
    const settingsIcon = document.querySelector('#settings-icon')
    const settingsContainer = document.querySelector('#settings-container')

    chartIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        settingsContainer.classList.add('hidden')
        if (drawer.classList.contains('closed')) drawer.classList.remove('closed')
    })

    settingsIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        settingsContainer.classList.remove('hidden')
        if (drawer.classList.contains('closed')) drawer.classList.remove('closed')
    })

    window.addEventListener('click', (e) => {
        const rect = drawer.getBoundingClientRect()
        if (!drawer.classList.contains('closed') && (e.clientX < rect.left || e.clientY > rect.bottom)) drawer.classList.add('closed')
    })
}

export { updateChart, resetChart }
