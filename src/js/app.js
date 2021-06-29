import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1600
canvas.height = 900

class Ball {
  constructor() {
    this.r = Math.random() * 20 + 20
    this.x = Math.random() * (canvas.width - 2 * this.r) + this.r
    this.y = Math.random() * (canvas.height - 2 * this.r) + this.r
    this.originalColor = `rgb(0, 
      ${Math.random() * 255},
      ${Math.random() * 255})`
    this.color = this.originalColor
  } 
  
  draw() {
    context.fillStyle = this.color
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.fill()
  }
}

const ball = new Ball()
ball.draw()