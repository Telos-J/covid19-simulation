import * as PIXI from 'pixi.js'
import { app, spatialHash } from './app'
import { add, sub, dot, magnitude, scale, normalize } from './vector'

class Ball extends PIXI.Graphics {
    constructor(maskProb, vaccineProb) {
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
        this.originalColor = PIXI.utils.rgb2hex([0, Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2])
        this.condition = 'susceptable'
        this.vaccinated = Math.random() < vaccineProb
        this.hasMask = this.vaccinated ? false : Math.random() < maskProb
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
            this.arc(0, 0, this.r, 0, Math.PI * 2)
            this.endFill()
            this.beginFill(color)
            this.arc(0, 0, this.r / 2, 0, Math.PI * 2)
            this.endFill()
        } else if (this.vaccinated) {
            this.beginFill(0xffff00)
            this.arc(0, 0, this.r, 0, Math.PI * 2)
            this.endFill()
            this.beginFill(color)
            this.arc(0, 0, this.r / 2, 0, Math.PI * 2)
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
        loop:
        for (let cell of this.cells)
            for (let ball of cell) {
                const d = Math.hypot(this.x - ball.x, this.y - ball.y)
                if (this !== ball && d < this.r + ball.r && this.condition !== 'dead' && ball.condition !== 'dead') {
                    this.bounce(ball)
                    this.contage(ball)
                    break loop;
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
        let r = 0.23
        if (this.condition === 'infected' && ball.condition === 'susceptable') {
            if (this.hasMask) r *= 0.3
            if (ball.hasMask) r *= 0.01
            if (ball.vaccinated) r *= 0
            if (Math.random() < r) {
                ball.condition = 'infected'
                ball.infectedFrame = app.ticker.frame
                ball.color(0xff0000)
            }
        } else if (ball.condition === 'infected' && this.condition === 'susceptable') {
            if (ball.hasMask) r *= 0.3
            if (this.hasMask) r *= 0.01
            if (this.vaccinated) r *= 0
            if (Math.random() < r) {
                this.condition = 'infected'
                this.infectedFrame = app.ticker.frame
                this.color(0xff0000)
            }
        }
    }

    updateCondition() {
        if (this.condition === 'infected' && app.ticker.frame - this.infectedFrame > 200) {
            if (Math.random() < fatality) {
                this.condition = 'dead'
                this.tint = 0x000000
                this.zIndex = -1
            } else {
                this.condition = 'recovered'
                this.color(this.originalColor)
            }
        }
    }
}

let numBalls = 5000, fatality
const balls = new PIXI.Container()
balls.sortableChildren = true

function setupBalls(maskProb, vaccineProb, fatalityProb) {
    if (!app.stage.children.length) app.stage.addChild(balls);
    fatality = fatalityProb
    for (let i = 0; i < numBalls; i++) {
        const ball = new Ball(maskProb, vaccineProb)
        if (i === 0) {
            ball.condition = 'infected'
            ball.infectedFrame = 0
            ball.color(0xff0000)
        }
        balls.addChild(ball)
        spatialHash.insert(ball)
    }
}

export { balls, setupBalls }