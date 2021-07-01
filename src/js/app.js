import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'

import * as PIXI from 'pixi.js'
import * as Stats from 'stats.js'

/////////////////
// Hello World //
/////////////////

const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas'
PIXI.utils.sayHello(type)

////////////////////////
// Create Application //
////////////////////////

const canvas = document.querySelector('canvas')

const app = new PIXI.Application({
    view: canvas,
    width: 1600 / 4,
    height: 900 / 4,
    backgroundColor: 0x1099bb,
    resolution: devicePixelRatio || 1
});

const numBunnies = 100
const container = new PIXI.ParticleContainer(numBunnies, { tint: true })
app.stage.addChild(container)

///////////
// Stats //
///////////

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

////////////////////
// Loading Images // 
////////////////////

const loader = PIXI.Loader.shared,
    Sprite = PIXI.Sprite

loader.add('bunny', 'img/bunny.png')
    .load(setup)

loader.onProgress.add(handleProgress)

function handleProgress(loader, resource) {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
}


////////////////
// Game Logic //
////////////////

function setup(loader, resources) {
    for (let i = 0; i < numBunnies; i++) {
        const bunny = new Sprite(resources.bunny.texture);
        bunny.anchor.set(0.5)
        bunny.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height)

        bunny.speed = 2
        bunny.scale.set(0.25 + 0.25 * Math.random())
        const angle = Math.random() * Math.PI * 2
        bunny.velocity = new PIXI.Point(bunny.speed * Math.cos(angle), bunny.speed * Math.sin(angle))

        container.addChild(bunny);
    }

    app.ticker.add(gameLoop);
}

function makeInteractive(bunny) {
    bunny.interactive = true
    bunny.buttonMode = true
    bunny.on('pointerover', () => bunny.tint = 0xff0000)
    bunny.on('pointerout', () => bunny.tint = 0xffffff)
}

function gameLoop(deltaTime) {
    stats.begin()
    for (const bunny of container.children) {
        bunny.position.x += bunny.velocity.x * deltaTime
        bunny.position.y += bunny.velocity.y * deltaTime
        bound(bunny)
        detectCollision(bunny)
    }
    stats.end()
}

function detectCollision(bunny) {
    bunny.tint = 0xffffff
    for (const otherBunny of container.children) {
        if (testForAABB(bunny, otherBunny)) {
            bunny.tint = 0xff0000
            break
        }
    }
}

function bound(obj) {
    if (obj.position.x < 0) {
        obj.position.x = 0
        obj.velocity.x *= -1
    }
    if (obj.position.y < 0) {
        obj.position.y = 0
        obj.velocity.y *= -1
    }
    if (obj.position.x > app.screen.width) {
        obj.position.x = app.screen.width
        obj.velocity.x *= -1
    }
    if (obj.position.y > app.screen.height) {
        obj.position.y = app.screen.height
        obj.velocity.y *= -1
    }
}

function testForAABB(object1, object2) {
    if (object1 === object2) return false

    return object1.x < object2.x + object2.width
        && object1.x + object1.width > object2.x
        && object1.y < object2.y + object2.height
        && object1.y + object1.height > object2.y;
}
