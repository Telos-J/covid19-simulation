import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'

//comment
// This is an important comment

const canvas= document.querySelector('canvas')
const context= canvas.getContext('2d')
canvas.width = 1600
canvas.height = 900


class Ball{
    constructor(){
        this.r=Math.random()*40+40
        this.x=Math.random()*(canvas.width-2*this.r)
        this.y=Math.random()*(canvas.height-2*this.r)+this.r
        this.vx=Math.random()*5
        this.vy=Math.random()
        this.color='blue'
    }

    move(){
        this.x+=this.vx
        this.y+=this.vy
    }

    draw() {
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        context.fill()
      }
    
}

const ball=new Ball()
ball.draw()

let numBalls=20
const ballsArray=[]

for (let i=0; i< numBalls; i++){
    ballsArray.push(new Ball())
    }

for (const ball of ballsArray){
    ball.draw()
}

function update(){
    for (const ball of ballsArray){
        ball.move()
    }
}
function render() {
    context.clearRect(0,0,canvas.width,canvas.height)
    for(const ball of ballsArray){
        ball.draw()
    }
}

function loop(){
    update()
    render()
    requestAnimationFrame(loop)
}
loop()