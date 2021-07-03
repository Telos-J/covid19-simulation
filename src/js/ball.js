const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

class Ball {
    constructor() {
        this.r = Math.random() * 20 + 20
        this.x = Math.random() * (canvas.width - 2 * this.r)
        this.y = Math.random() * (canvas.height - 2 * this.r) + this.r
        this.speed = Math.random() * 5 + 5
        const rotation = Math.random() * Math.PI * 2
        this.vx = this.speed * Math.cos(rotation)
        this.vy = this.speed * Math.sin(rotation)
        this.originalColor = `rgb(244,194,194)`
        this.color = this.originalColor
    }

    move() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < this.r || this.x > canvas.width - this.r)
            this.vx *= -1
        if (this.y < this.r || this.y > canvas.height - this.r)
            this.vy *= -1
    }

    draw() {
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        context.fill()
    }

    collide() {
        this.color = this.originalColor
        for (const ball of ballsArray) {
            const d = Math.hypot(this.x - ball.x, this.y - ball.y)
            if (this !== ball && d < this.r + ball.r) {
                this.color = 'purple'
                break
            }
        }
    }
}

let numBalls = 20
const ballsArray = []

for (let i = 0; i < numBalls; i++) {
    ballsArray.push(new Ball())
}

export { ballsArray }
