import * as PIXI from 'pixi.js'
import { app } from './app'

class Ball extends PIXI.Sprite {
    constructor() {
        super()
        this.r = Math.random() * 20 + 20
        this.x = Math.random() * (app.screen.width - 2 * this.r) + this.r
        this.y = Math.random() * (app.screen.height - 2 * this.r) + this.r
        this.anchor.set(0.5)

        const rotation = Math.random() * Math.PI * 2
        this.speed = Math.random() * 5 + 5
        this.vx = this.speed * Math.cos(rotation)
        this.vy = this.speed * Math.sin(rotation)
        this.originalColor = Math.random() * 0xffffff
        this.tint = this.originalColor

        const graphic = new PIXI.Graphics()
        graphic.beginFill(0xffffff)
        graphic.arc(0, 0, this.r, 0, Math.PI * 2)
        graphic.endFill()
        this.texture = app.renderer.generateTexture(graphic)
    }

    move() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < this.r || this.x > app.screen.width - this.r)
            this.vx *= -1
        if (this.y < this.r || this.y > app.screen.height - this.r)
            this.vy *= -1
    }

    collide() {
        this.tint = this.originalColor
        for (const ball of balls.children) {
            const d = Math.hypot(this.x - ball.x, this.y - ball.y)
            if (this !== ball && d < this.r + ball.r) {
                this.tint = 0xff0000
                break
            }
        }
    }
}

const numBalls = 100
const balls = new PIXI.ParticleContainer(numBalls, { tint: true });

function setupBalls() {
    app.stage.addChild(balls);
    for (let i = 0; i < numBalls; i++) {
        balls.addChild(new Ball())
    }
}

export { balls, setupBalls }
