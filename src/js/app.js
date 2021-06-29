import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'

const canvas = document('canvas')
const context = canvas.getContext('2d')

class Ball {
    constructor() {
        this.r = Math.random() * 20 + 20
        this.x = Math.random() * 
    (canvas.width - 2 * r) + r
        this.y = Math.random() * 
    (canvas.height - 2 * r) + r
        this.speed = Math.random() * 5 + 5
    }
}
