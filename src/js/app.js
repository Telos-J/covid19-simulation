import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'

const canvas =  document.querySelector('canvas')
const context = canvas.getContext('2d')
canvas.width = 1600
canvas.height = 900

class Ball {
    constructor() {
        
            const r = Math.random() * 20 + 20
            const x = Math.random() * (canvas.width - 2 * r) + r
            const y = Math.random() * (canvas.height - 2 * r) + r
        }
        drawCircle() {
            context.fillStyle = 'blue'
            context.beginPath()
            context.arc(x, y, r, 0, Math.PI * 2)
            context.fill()
        }
}

const ball = new Ball()
ball.drawCircle() 

let r = 20, numBalls = 10, balls = []

for (let i=0; i<numBalls; i++) {
    balls.push(new Ball())
}

for (const ball of balls) {
    ball.drawCircle()
}

