import * as PIXI from 'pixi.js'
import { app } from './app'
import { add, sub, scale, dot, magnitude, normalize } from './helper'

class Ball extends PIXI.Sprite {
    constructor() {
        super()
        this.r = Math.random() * 10 + 10
        this.x = Math.random() * (app.screen.width - 2 * this.r) + this.r
        this.y = Math.random() * (app.screen.height - 2 * this.r) + this.r
        this.anchor.set(0.5)

        this.speed = Math.random() * 2 + 2
        this.rotation = Math.random() * Math.PI * 2
        this.velocity = new PIXI.Point(
            this.speed * Math.cos(this.rotation),
            this.speed * Math.sin(this.rotation)
        )

        this.originalColor = Math.random() < 0.002 ? 0xff0000 : Math.random() * 0x00ffff
        this.tint = this.originalColor

        const graphic = new PIXI.Graphics()
        graphic.beginFill(0xffffff)
        graphic.arc(0, 0, this.r, 0, Math.PI * 2)
        graphic.endFill()
        this.texture = app.renderer.generateTexture(graphic)
    }

    get vx() {
        return this.velocity.x
    }

    get vy() {
        return this.velocity.y
    }

    set vx(val) {
        this.velocity.x = val
    }

    set vy(val) {
        this.velocity.y = val
    }

    move() {
        this.position = add(this.position, this.velocity)
        if (this.x < this.r) {
            this.x = this.r
            this.vx *= -1
        }
        if (this.x > app.screen.width - this.r) {
            this.x = app.screen.width - this.r
            this.vx *= -1
        }
        if (this.y < this.r) {
            this.y = this.r
            this.vy *= -1
        }
        if (this.y > app.screen.height - this.r) {
            this.y = app.screen.height - this.r
            this.vy *= -1
        }
    }

    collide() {
        for (const ball of balls.children) {
            const d = Math.hypot(this.x - ball.x, this.y - ball.y)
            if (this !== ball && d < this.r + ball.r) {
                if ((this.tint === 0xff0000 || ball.tint === 0xff0000) && Math.random() < 0.2) {
                    this.tint = 0xff0000
                    ball.tint = 0xff0000
                }
                this.bounce(ball)
                break
            }
        }
    }

    bounce(ball) {
        const n1 = normalize(sub(this.position, ball.position))
        const n2 = normalize(sub(ball.position, this.position))
        const velocity = this.velocity
        const speed = this.speed

        this.velocity = ball.velocity
        this.speed = ball.speed
        this.position = add(this.position, scale(n1, this.speed))

        ball.velocity = velocity
        ball.speed = speed
        ball.position = add(ball.position, scale(n2, ball.speed))
    }
}

const numBalls = 1000
const balls = new PIXI.ParticleContainer(numBalls, { tint: true });

function setupBalls() {
    app.stage.addChild(balls);
    for (let i = 0; i < numBalls; i++) {
        balls.addChild(new Ball())
    }
}

export { balls, setupBalls }
