import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'
import { balls, setupBalls } from './ball'
import * as PIXI from 'pixi.js'
import * as Stats from 'stats.js'

const canvas = document.querySelector('canvas')

const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas'
PIXI.utils.sayHello(type)

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

let app = new PIXI.Application({
    view: canvas,
    width: 1600,
    height: 900,
    backgroundAlpha: 0,
    resolution: devicePixelRatio || 1
});

PIXI.Loader.shared.load(setupBalls)
app.ticker.add(loop)

function loop(deltaTime) {
    stats.begin()
    for (const ball of balls.children) {
        ball.move()
        ball.collide()
    }
    stats.end()
}

export { app }
