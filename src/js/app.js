import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'
import './settings'
import { SpatialHash } from './spatialhash'
import { balls, setupBalls } from './ball'
import { updateChart } from './chart'
import * as PIXI from 'pixi.js'
import * as Stats from 'stats.js'

const canvas = document.querySelector('#sim')

const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas'
PIXI.utils.sayHello(type)

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const app = new PIXI.Application({
    view: canvas,
    width: 1600,
    height: 900,
    backgroundAlpha: 0,
    resolution: devicePixelRatio || 1
});

app.stage.sortableChildren = true
app.renderer.plugins.interaction.autoPreventDefault = false;

let spatialHash = new SpatialHash([[0, 0], [1600, 900]], [100, 100])

PIXI.Loader.shared.load((loader, resources) => setupBalls())
app.ticker.maxFPS = 30
app.ticker.frame = 0
app.ticker.add(loop)

function loop(deltaTime) {
    stats.begin()
    for (let ball of balls.children) {
        if (ball.condition === 'dead') continue
        spatialHash.update(ball)
        ball.move()
        ball.collide()
        ball.updateCondition()
    }
    updateChart()
    stats.end()
    app.ticker.frame++
}

export { app, spatialHash }
