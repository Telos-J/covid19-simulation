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
    backgroundAlpha: 0,
    resolution: devicePixelRatio || 1
});

let balls = new PIXI.Container();
app.stage.addChild(balls);

const ball = new PIXI.Sprite()

const graphic = new PIXI.Graphics()
graphic.beginFill()
graphic.arc(0, 0, 50, 0, Math.PI * 2)
graphic.endFill()

ball.texture = app.renderer.generateTexture(graphic)
balls.addChild(ball)


app.ticker.add(gameLoop)

function gameLoop(deltaTime) {
    ball.x += 5 * deltaTime
}