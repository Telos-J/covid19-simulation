import { spatialHash } from "./app";
import { balls, setupBalls } from "./ball";

const sliderProps = {
    fill: "#0B1EDF",
    background: "rgba(255,255,255,0.214)",
};

const slider = document.querySelector(".range__slider");
const sliderValue=documnet.queryselector(".length__title");

function applyFill(slider){
    const percentage = ((100*slider.value-slider.min)/(slider.max))
    const bg='linear-gradient(90deg,${sliderProps.fill} ${percentage}'
    slider.style.background=bg;
    sliderValue.setAttribute("data-length", slider.value);
}

applyFill(slider.querySelector("input"));

slider.querySelector("input").addEventListener("input",event => {
    sliderValue.setAttribute("data-length",event.target.value);
});

function reset(){
    balls.removeChildren()
    spatialHash.resetHash([[0,0],[1600,900]],[100,100])
    setupBalls()
    //remove all the balls from the container 
    //reset spatial hash
    //populate both container and hash 
    const maskProb=parseInt(sliderValue.getAttribute('data-length'))/100
    setupBalls(maskProb)
}

document.querySelector('.btn').addEventListener('click',reset)