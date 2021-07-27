import { balls, setupBalls } from './ball'
import { app, spatialHash } from './app'
import { chart, resetChart } from './chart'

////////////
// Slider //
////////////

const sliderProps = {
    fill: "#0B1EDF",
    background: "rgba(255, 255, 255, 0.214)",
};

const rangeSliders = document.querySelectorAll('.range__slider')

function updateSlider(rangeSlider) {
    const slider = rangeSlider.querySelector('.slider')
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
    const sliderValue = rangeSlider.querySelector(".length__title");
    slider.style.background = bg;
    sliderValue.setAttribute("data-length", slider.value);
}

for (let rangeSlider of rangeSliders) {
    updateSlider(rangeSlider);
    rangeSlider.addEventListener("input", event => {
        updateSlider(event.target.parentNode);
    });
}

function getValue(id) {
    return parseInt(document.querySelector(`#${id} .length__title`).getAttribute('data-length'))
}

////////////
// Switch //
////////////

const stackSwitch = document.querySelector('#stack')
const fatalitySwitch = document.querySelector('#show-fatality')
const perimeterSwitch = document.querySelector('#set-perimeter')

fatalitySwitch.addEventListener('input', () => {
    for (const ball of balls.children) {
        if (!showFatalitySwitch.checked) ball.alpha = 1
        else if (ball.condition !== 'dead') ball.alpha = 0
    }
})

////////////
// Button //
////////////

function reset() {
    app.ticker.frame = 0
    balls.removeChildren()
    spatialHash.resetHash()
    setupBalls(
        getValue('balls-slider'),
        getValue('mask-slider') / 100,
        getValue('vaccination-slider') / 100,
        getValue('fatality-slider') / 100,
        perimeterSwitch.checked
    )
    if (!stackSwitch.checked) resetChart()
    fatalitySwitch.checked = false
    chart.config.finished = false
}

document.querySelector('.btn').addEventListener('click', reset)
