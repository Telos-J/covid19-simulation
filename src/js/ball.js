import * as PIXI from 'pixi.js'
import { app, spatialHash } from './app'
import { add, sub, dot, magnitude, scale, normalize } from './vector'

class Ball extends PIXI.Graphics {
    constructor(maskProb = 0) {
        const rotation = Math.random() * Math.PI * 2
        super()
        this.r = Math.random() * 5 + 5
        this.x = Math.random() * (app.screen.width - 2 * this.r) + this.r
        this.y = Math.random() * (app.screen.height - 2 * this.r) + this.r
        this.speed = 2
        this.velocity = new PIXI.Point(
            this.speed * Math.cos(rotation),
            this.speed * Math.sin(rotation)
        )
        this.originalColor = Math.random() * 0x00ffff
        this.infected = false
        this.hasMask = Math.random() < maskProb
        this.color(this.originalColor)
        this.cells = []
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

    color(color) {
        this.clear()
        if (this.hasMask) {
            this.beginFill(0xffffff)
            this.arc(0, 0, this.r, 0, Math.PI)
            this.endFill()
            this.beginFill(color)
            this.arc(0, 0, this.r, Math.PI, Math.PI * 2)
            this.endFill()
        } else {
            this.beginFill(color)
            this.arc(0, 0, this.r, 0, Math.PI * 2)
            this.endFill()
        }
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
        for (let cell of this.cells)
            for (let ball of cell) {
                const d = Math.hypot(this.x - ball.x, this.y - ball.y)
                if (this !== ball && d < this.r + ball.r) {
                    this.bounce(ball)
                    this.contage(ball)
                    break;
                }
            }
    }

    bounce(ball) {
        const m = scale(add(this.position, ball.position), 0.5)
        const n1 = normalize(sub(this.position, ball.position), this.r)
        const n2 = normalize(sub(ball.position, this.position), ball.r)

        this.position = add(m, n1)
        ball.position = add(m, n2)

        const velocity = this.velocity
        this.velocity = ball.velocity
        ball.velocity = velocity
    }

    contage(ball) {
        if (this.infected) {
            const r = this.hasMask ? 0.23 * 0.3 : 0.23
            if (Math.random() < r) {
                ball.infected = true
                ball.color(0xff0000)
            }

        } else if (ball.infected) {
            const r = ball.hasMask ? 0.23 * 0.01 : 0.23
            if (Math.random() < r) {
                this.infected = true
                this.color(0xff0000)
            }

        }
    }
}

const numBalls = 5000, numInfected = 1
const balls = new PIXI.Container()

function setupBalls(maskProb) {
    if (!app.stage.children.length) app.stage.addChild(balls);
    for (let i = 0; i < numBalls; i++) {
        const ball = new Ball(maskProb)
        if (i < numInfected) {
            ball.infected = true
            ball.color(0xff0000)
        }
        balls.addChild(ball)
        spatialHash.insert(ball)
    }
}

export { balls, setupBalls }
