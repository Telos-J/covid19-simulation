import { balls, setupBalls } from './ball'
import { app, spatialHash } from './app'
import { resetChart } from './chart'

const sliderProps = {
    fill: "#0B1EDF",
    background: "rgba(255, 255, 255, 0.214)",
};

const slider = document.querySelector(".range__slider");
const sliderValue = document.querySelector(".length__title");

function applyFill(slider) {
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
    slider.style.background = bg;
    sliderValue.setAttribute("data-length", slider.value);
}

applyFill(slider.querySelector("input"));

slider.querySelector("input").addEventListener("input", event => {
    sliderValue.setAttribute("data-length", event.target.value);
    applyFill(event.target);
});

function reset() {
    app.ticker.frame = 0
    balls.removeChildren()
    spatialHash.resetHash()
    const maskProb = parseInt(sliderValue.getAttribute('data-length')) / 100
    setupBalls(maskProb)
    //resetChart()
}

document.querySelector('.btn').addEventListener('click', reset)
