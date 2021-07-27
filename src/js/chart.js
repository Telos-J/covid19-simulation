import { Chart, registerables } from 'chart.js';
import { balls, numVaccinated, numMasks } from './ball'
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

const susceptible = {
    label: 'Susceptible',
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
    datasets: [infected, susceptible, dead, recovered]
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
    let numSusceptible = 0, numInfected = 0, numDead = 0, numRecovered = 0, peak = 0;
    if (chart.config.finished) return
    for (let ball of balls.children) {
        if (ball.condition === 'susceptible') numSusceptible++
        else if (ball.condition === 'infected') numInfected++
        else if (ball.condition === 'dead') numDead++
        else if (ball.condition === 'recovered') numRecovered++
    }
    labels.push(app.ticker.frame)
    infected.data.push(numInfected)
    susceptible.data.push(numSusceptible)
    dead.data.push(numDead)
    recovered.data.push(numRecovered)
    //chart.config.finished = infectedNum === 0
    if (numInfected === 0) {
        chart.config.finished = true
        for (const label of labels) {
        }
        console.log(`peak: ${peak}, frames: ${labels.length}, susceptible: ${susceptible.data[labels.length - 1]}, dead: ${dead.data[labels.length - 1]}`)
    }

    updateNumbers(numSusceptible, numInfected, numDead, numRecovered, labels.length, numVaccinated, numMasks)
}

function updateNumbers(numSusceptible, numInfected, numDead, numRecovered, numFrames, numVaccinated, numMasks) {
    const susceptible = document.querySelector('#susceptible .data')
    susceptible.innerHTML = numSusceptible
    const infected = document.querySelector('#infected .data')
    infected.innerHTML = numInfected
    const dead = document.querySelector('#dead .data')
    dead.innerHTML = numDead
    const recovered = document.querySelector('#recovered .data')
    recovered.innerHTML = numRecovered
    const peak = document.querySelector('#peak .data')
    peak.innerHTML = Math.max(parseInt(peak.innerHTML), numInfected)
    const frames = document.querySelector('#frames .data')
    frames.innerHTML = numFrames
    const vaccinated = document.querySelector('#vaccinated .data')
    vaccinated.innerHTML = numVaccinated
    const masks = document.querySelector('#masks .data')
    masks.innerHTML = numMasks
}

function resetChart() {
    labels.length = 0
    infected.data.length = 0
    susceptible.data.length = 0
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
        if (drawer.classList.contains('closed')) drawer.classList.remove('closed')
        else if (settingsWrapper.classList.contains('hidden')) drawer.classList.add('closed')
        settingsWrapper.classList.add('hidden')
    })

    settingsIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        if (drawer.classList.contains('closed')) drawer.classList.remove('closed')
        else if (!settingsWrapper.classList.contains('hidden')) drawer.classList.add('closed')
        settingsWrapper.classList.remove('hidden')
    })

    window.addEventListener('click', (e) => {
        const rect = drawer.getBoundingClientRect()
        if (!drawer.classList.contains('closed') && (e.clientX < rect.left || e.clientY > rect.bottom)) drawer.classList.add('closed')
    })
}

export { chart, updateChart, resetChart, updateNumbers }
