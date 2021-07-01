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
        
        context.fillStyle = 'blue'
        
        function drawCircle(x, y) {
            context.beginPath()
            context.arc(x, y, r, 0, Math.PI * 2)
            context.fill()
        }
        
        drawCircle(x, y)
    }
}

const balls = new Ball()