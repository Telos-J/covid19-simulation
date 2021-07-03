import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'
import * as PIXI from 'pixi.js'

const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas'
PIXI.utils.sayHello(type)

const canvas = document.querySelector('canvas')

let app = new PIXI.Application({
    view: canvas,
    width: 1600,
    height: 900,
    backgroundAlpha: 1,
    resolution: devicePixelRatio || 1
});

function update() {
    for (const ball of ballsArray) {
        ball.move()
        ball.collide()
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (const ball of ballsArray) {
        ball.draw()
    }
}

function loop() {
    update()
    render()
    requestAnimationFrame(loop)
}

// loop()
