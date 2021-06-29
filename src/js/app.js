import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'

//comment
// This is an important comment

const canvas= docuument.quertSelector('canvas')
const context= canvas.getContext('2d')

const r=7
const X=math.random()*(canvas.width-2*r)
const Y=math.random()*(canvas.height-2*r)
const vx=Math.random()*10*cos(Math.random()*Math.PI*2)
const vy=Math.random()*10*sin(Math.random()*Math.PI*2)

class Ball{
    constructor(){
        this.r=Math.random()*40+40
        this.x=Math.random()*(canvas.width-2*r)
        this.y=Math.random()*(canvas.height-2*r)+this.r 
        this.speed=Math.random()*10+10
        const rotation=Math.random()*Math.PI*2
        this.vx=this.speed*Math.cos(rotation)
        this.vy=this.speed*Math.sin(rotation)
    }
    move() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < this.r || this.x > canvas.width - r) 
          this.vx *= -1
        if (this.y < this.r || this.y > canvas.height - r) 
          this.vy *= -1
      }
    collide(){
        for(const ball of balls){
            const d=Math.hypot(this.x-ball.x,this.y-ball,y)
            if (this!== ball && d<this.r+ball.r){
                this.color='red'
                break
                }
            }
        }
    }
    draw() {
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        context.fill()
      }
    
}
