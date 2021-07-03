import * as PIXI from 'pixi.js'
import {app} from './app'

class Ball {
    constructor() {
        super()
        this.r = Math.random() * 20 + 20
        this.x = Math.random() * (app.screenwidth - 2 * this.r)
        this.y = Math.random() * (app.screenheight - 2 * this.r) + this.r
        this.speed = Math.random() * 5 + 5
        const rotation = Math.random() * Math.PI * 2
        this.vx = this.speed * Math.cos(rotation)
        this.vy = this.speed * Math.sin(rotation)
        this.originalColor = `rgb(244,194,194)`
        this.tint = this.originalColor
        const graphic=new PIXI.Graphics()
        graphic.beginFill(0xffffff)
        graphic.arc(0,0,50,0,Math.PI)
        graphic.endFill()
        this.texture=app.renderer.generateTexture(graphic)
    }

    move() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < this.r || this.x > app.screenwidth - this.r)
            this.vx *= -1
        if (this.y < this.r || this.y > app.screenheight - this.r)
            this.vy *= -1
    }

    collide() {
        this.tint = this.originalColor
        for (const ball of balls) {
            const d = Math.hypot(this.x - ball.x, this.y - ball.y)
            if (this !== ball && d < this.r + ball.r) {
                this.tint = 'purple'
                break
            }
        }
    }
}
const numBalls=100
let balls=new PIXI.ParticleContainer(numBalls,{tint:true})

setTimeout(()=>{
    app.stage.addChild(balls);
    for (let i=0 ; i < numBalls; i++ ) {
        balls.addChild(new Ball())
    }
}, 1000)

export{balls}
