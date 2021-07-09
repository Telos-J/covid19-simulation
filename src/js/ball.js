import * as PIXI from 'pixi.js'
import { app, spatialHash } from './app'
import { add, sub, dot, magnitude, scale, normalize } from './vector'

class Ball extends PIXI.Graphics {
    constructor() {
        const speed = 2
        const rotation = Math.random() * Math.PI * 2
        super()
        this.r = Math.random() * 3 + 3
        this.x = Math.random() * (app.screen.width - 2 * this.r) + this.r
        this.y = Math.random() * (app.screen.height - 2 * this.r) + this.r
        this.velocity = new PIXI.Point(
            speed * Math.cos(rotation),
            speed * Math.sin(rotation)
        )
        this.originalColor = Math.random() < 0.0001 ? 0xff0000 : Math.random() * 0x00ffff
        this.tint = this.originalColor
        this.beginFill(0xffffff)
        this.arc(0, 0, this.r, 0, Math.PI * 2)
        this.endFill()
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
                    break
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
        if ((this.tint === 0xff0000 || ball.tint === 0xff0000) && Math.random() < 0.23) {
            this.tint = 0xff0000
            ball.tint = 0xff0000
        }
    }
}

const numBalls = 10000
const balls = new PIXI.Container()

function setupBalls() {
    app.stage.addChild(balls);
    for (let i = 0; i < numBalls; i++) {
        const ball = new Ball()
        balls.addChild(ball)
        spatialHash.insert(ball)
    }
}

export { balls, setupBalls }
