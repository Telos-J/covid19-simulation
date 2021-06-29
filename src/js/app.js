import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'

const canvas = document('canvas')
const context = canvas.getContext('2d')

draw() {
    context.fillStyle = this.color
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.fill()
  }
