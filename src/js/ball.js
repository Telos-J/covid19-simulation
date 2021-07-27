import * as PIXI from 'pixi.js'
import { app, spatialHash } from './app'
import { add, sub, dot, magnitude, scale, normalize } from './vector'

class Ball extends PIXI.Graphics {
    constructor(r, hasMask, efficacy) {
        const rotation = Math.random() * Math.PI * 2
        super()
        this.r = Math.random() * 5 + r
        this.x = Math.random() * (app.screen.width - 2 * this.r) + this.r
        this.y = Math.random() * (app.screen.height - 2 * this.r) + this.r
        this.speed = 2
        this.velocity = new PIXI.Point(
            this.speed * Math.cos(rotation),
            this.speed * Math.sin(rotation)
        )
        this.originalColor = PIXI.utils.rgb2hex([0, Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2])
        this.condition = 'susceptible'
        this.vaccinated = false
        this.effective = Math.random() < efficacy
        this.hasMask = hasMask
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
        } else {
            this.beginFill(color)
            this.arc(0, 0, this.r, 0, Math.PI * 2)
            this.endFill()
        }
    }

    vaccinate() {
        this.vaccinated = true
        this.clear()
        this.beginFill(0xffff00)
        this.arc(0, 0, this.r, 0, Math.PI * 2)
        this.endFill()
        this.beginFill(this.originalColor)
        this.arc(0, 0, this.r / 2, 0, Math.PI * 2)
        this.endFill()
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
        if (this.condition === 'infected' && ball.condition === 'susceptible') {
            if (this.hasMask) r *= 0.3
            if (ball.hasMask) r *= 0.01
            if (ball.vaccinated && ball.effective) r *= 0
            if (Math.random() < r) {
                ball.condition = 'infected'
                ball.infectedFrame = app.ticker.frame
                ball.color(0xff0000)
            }
        } else if (ball.condition === 'infected' && this.condition === 'susceptible') {
            if (ball.hasMask) r *= 0.3
            if (this.hasMask) r *= 0.01
            if (this.vaccinated && this.effective) r *= 0
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
                this.alpha = 1
            } else {
                this.condition = 'recovered'
                this.color(this.originalColor)
            }
        }
    }
}

let fatality, numVaccinated, numMasks
const balls = new PIXI.Container()
balls.sortableChildren = true

function setupBalls(numBalls = 5000, maskProb = 0, vaccineProb = 0, fatalityProb = 0.2, perimeter = false) {
    if (!app.stage.children.includes(balls)) app.stage.addChild(balls);
    fatality = fatalityProb
    const r = 37 / 180000000 * numBalls ** 2 - 209 / 60000 * numBalls + 311 / 18
    for (let i = 0; i < numBalls; i++) {
        const ball = new Ball(r, i < numBalls * maskProb, 0.95)
        balls.addChild(ball)
        spatialHash.insert(ball)
    }

    vaccinate(perimeter, vaccineProb)
    numVaccinated = countVaccinated()
    numMasks = countMasks()
    outbreak()
}

function outbreak() {
    const ball = balls.children[0]
    ball.condition = 'infected'
    ball.infectedFrame = 0
    ball.color(0xff0000)
    ball.position.set(app.screen.width / 2, app.screen.height / 2)
}

function vaccinate(perimeter, vaccineProb) {
    if (perimeter) vaccinatePerimeter(vaccineProb)
    else vaccinateRandomly(vaccineProb)
}

function vaccinatePerimeter(vaccineProb) {
    const sortedBalls = balls.children
        .sort((ball1, ball2) => {
            return Math.hypot(app.screen.width / 2 - ball1.x, app.screen.height / 2 - ball1.y) - Math.hypot(app.screen.width / 2 - ball2.x, app.screen.height / 2 - ball2.y)
        })
    const threshold = sortedBalls.findIndex(ball => Math.hypot(app.screen.width / 2 - ball.x, app.screen.height / 2 - ball.y) >= app.screen.height / 3)

    for (let i = 0; i < Math.floor(balls.children.length * vaccineProb); i++) {
        if (i + threshold < sortedBalls.length) sortedBalls[i + threshold].vaccinate()
        else sortedBalls[sortedBalls.length - i - 1].vaccinate()
    }
}

function vaccinateRandomly(vaccineProb) {
    for (let i = 0; i < Math.floor(balls.children.length * vaccineProb); i++) {
        balls.children[i].vaccinate()
    }
}

function countVaccinated() {
    const vaccinated = balls.children.filter(ball => ball.vaccinated)
    return vaccinated.length
}


function countMasks() {
    const masks = balls.children.filter(ball => ball.hasMask)
    return masks.length
}

export { balls, setupBalls, numVaccinated, numMasks }
