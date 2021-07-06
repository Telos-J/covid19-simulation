import * as PIXI from 'pixi.js'
import {app} from './app'
import {add, sub, dot, magnitude, scale, normalize} from './vector.js'

class Ball extends PIXI.Sprite {
    constructor() {
        const speed=Math.random()*2+2
        const rotation=Math.random()*Math.PI*2
        super()
        this.r = Math.random() * 10 + 10
        this.x = Math.random() * (app.screen.width - 2 * this.r) + this.r
        this.y = Math.random() * (app.screen.height - 2 * this.r) + this.r
        this.velocity=new PIXI.Point(
            this.speed * Math.cos(this.rotation),
            this.speed * Math.sin(this.rotation)
        )
        this.originalColor = Math.random()<0.01 ? 0xff0000 : Math.random()*0x00ffff
        this.tint = this.originalColor
        this.beginFill(0xffffff)
        this.arc(0,0,this.r,0,Math.PI*2)
        this.endFill()
        this.texture=app.renderer.generateTexture(graphic)
    }

    get vx(){
        return this.velocity.x
    }

    get vy(){
        return this.velocity.y
    }

    set vx(val){
        this.velocity.x=val
    }

    set vy(val){
        this.velocity.y=val
    }

    move() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < this.r || this.x > app.screen.width - this.r)
            this.vx *= -1
        if (this.y < this.r || this.y > app.screen.height - this.r)
            this.vy *= -1
    }

    collide() {
        this.tint = this.originalColor
        for (const ball of balls.children) {
            const d = Math.hypot(this.x - ball.x, this.y - ball.y)
            if (this !== ball && d < this.r + ball.r) {
                this.bounce(ball)
                this.contage(ball)
                break
            }
        }
    }

    bounce(ball){
        const m=scale(add(this.position, ball.position),0.5)
        const n1=normalize(sub(this.position, ball.position), this.r)
        const n2=normalize(sub(this.position, ball.position), this.r)

        this.position=add(m,n1)
        ball.position=add(m,n2)

        const velocity=this.velocity 
        this.velocity =ball.velocity
        ball.velocity =velocity
    }
    contage(){
        if(this.tint==0xff0000||ball.tint==0xff0000&& Math.random()<0.23){
            this.tint=0xff0000
            ball.tint=0xff0000
        }
    }
}
const numBalls=100
let balls=new PIXI.ParticleContainer(numBalls,{tint:true})

function setupBalls(){
    app.stage.addChild(balls);
    for (let i=0 ; i < numBalls; i++ ) {
        balls.addChild(new Ball())
    }
}

export{balls, setupBalls}
