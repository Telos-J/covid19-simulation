import { Chart, registerables } from 'chart.js';
import { balls } from './ball'
import { app } from './app'
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
}

const susceptable = {
    label: 'Susceptable',
    backgroundColor: 'rgb(99, 255, 132)',
    borderWidth: 0,
    data: [],
    fill: true,
    radius: 0,
}

const dead = {
    label: 'Dead',
    backgroundColor: 'rgb(0, 0, 0)',
    borderWidth: 0,
    data: [],
    fill: true,
    radius: 0,
    //tension: 0.4
}

const recovered = {
    label: 'Recovered',
    backgroundColor: 'rgb(107, 76, 154)',
    borderWidth: 0,
    data: [],
    fill: true,
    radius: 0,
}

const data = {
    labels: labels,
    datasets: [infected, susceptable, dead, recovered]
}

const config = {
    type: 'line',
    data: data,
    finished: false,
    options: {
        responsive: true,
        animation: false,
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
    },
}

let chart = new Chart(
    document.getElementById('chart'),
    config
)

function updateChart() {
    let susceptableNum = 0, infectedNum = 0, deadNum = 0, recoveredNum = 0;
    for (let ball of balls.children) {
        if (ball.condition === 'susceptable') susceptableNum++
        else if (ball.condition === 'infected') infectedNum++
        else if (ball.condition === 'dead') deadNum++
        else if (ball.condition === 'recovered') recoveredNum++
    }
    if (!chart.config.finished) {
        labels.push(app.ticker.frame)
        infected.data.push(infectedNum)
        susceptable.data.push(susceptableNum)
        dead.data.push(deadNum)
        recovered.data.push(recoveredNum)
    }
    chart.config.finished = infectedNum === 0
}

function resetChart() {
    labels.length = 0
    infected.data.length = 0
    susceptable.data.length = 0
    dead.data.length = 0
    recovered.data.length = 0
}

setInterval(() => chart.update(), 100)

{ // UI/UX stuff
    const chartIcon = document.querySelector('#chart-icon')
    const settingsIcon = document.querySelector('#settings-icon')
    const settingsWrapper = document.querySelector('#settings-wrapper')

    chartIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        settingsWrapper.classList.add('hidden')
        if (drawer.classList.contains('closed')) drawer.classList.remove('closed')
    })

    settingsIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        settingsWrapper.classList.remove('hidden')
        if (drawer.classList.contains('closed')) drawer.classList.remove('closed')
    })

    window.addEventListener('click', (e) => {
        const rect = drawer.getBoundingClientRect()
        if (!drawer.classList.contains('closed') && (e.clientX < rect.left || e.clientY > rect.bottom)) drawer.classList.add('closed')
    })
}

export { updateChart, resetChart }
