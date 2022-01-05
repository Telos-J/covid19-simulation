import { balls, setupBalls } from './ball'
import { app, spatialHash } from './app'
import { chart, resetChart } from './chart'

////////////
// Slider //
////////////

const sliderProps = {
    fill: '#0B1EDF',
    background: 'rgba(255, 255, 255, 0.214)',
}

const rangeSliders = document.querySelectorAll('.range__slider')

function updateSlider(rangeSlider) {
    const slider = rangeSlider.querySelector('.slider')
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min)
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${
        sliderProps.background
    } ${percentage + 0.1}%)`
    const sliderValue = rangeSlider.querySelector('.length__title')
    slider.style.background = bg
    sliderValue.setAttribute('data-length', slider.value)
}

for (let rangeSlider of rangeSliders) {
    updateSlider(rangeSlider)
    rangeSlider.addEventListener('input', event => {
        updateSlider(event.target.parentNode)
    })
}

function getValue(id) {
    return parseInt(document.querySelector(`#${id} .length__title`).getAttribute('data-length'))
}

////////////
// Switch //
////////////

const stackSwitch = document.querySelector('#stack')
const perimeterSwitch = document.querySelector('#set-perimeter')
const fatalitySwitch = document.querySelector('#show-fatality')
const spatialHashSwitch = document.querySelector('#show-spatialhash')

fatalitySwitch.addEventListener('input', () => {
    for (const ball of balls.children) {
        if (!fatalitySwitch.checked) ball.alpha = 1
        else if (ball.condition !== 'dead') ball.alpha = 0
    }
})

spatialHashSwitch.addEventListener('input', () => {
    if (spatialHashSwitch.checked) spatialHash.turnOnGraphic()
    else spatialHash.turnOffGraphic()
})

////////////
// Button //
////////////

function reset() {
    app.ticker.frame = 0
    balls.removeChildren()
    spatialHash.resetHash(
        null,
        getValue('balls-slider') <= 3000 ? [100, 100] : [10, 10],
        getValue('balls-slider') <= 3000
    )
    setupBalls(
        getValue('balls-slider'),
        getValue('mask-slider') / 100,
        getValue('vaccination-slider') / 100,
        getValue('fatality-slider') / 100,
        perimeterSwitch.checked
    )
    if (!stackSwitch.checked) resetChart()
    fatalitySwitch.checked = false
    spatialHashSwitch.checked = false
    if (getValue('balls-slider') <= 3000) spatialHashSwitch.disabled = false
    else spatialHashSwitch.disabled = true
    chart.config.finished = false
}

document.querySelector('.btn').addEventListener('click', reset)
