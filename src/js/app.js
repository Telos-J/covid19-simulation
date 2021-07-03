import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { balls } from './ball'
import { Renderer } from 'pixi.js'


const canvas = document.querySelector('canvas')

let app = new PIXI.Application({
    view: canvas,
    width: 1600,
    height: 900,
    backgroundAlpha: 0,
    resolution: devicePixelRatio || 1
});


app.ticker.add(loop)

function loop(deltaTime){
    ball.move()
}

export{app}