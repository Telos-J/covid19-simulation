import * as PIXI from 'pixi.js'
import { app } from './app'

class SpatialHash {
    constructor(bounds, cellSize) {
        this.min = bounds[0]
        this.max = bounds[1]
        this.cellSize = cellSize
        this.numCol = Math.floor((this.max[0] - this.min[0]) / this.cellSize[0])
        this.numRow = Math.floor((this.max[1] - this.min[1]) / this.cellSize[1])
        this.cells = [...Array(this.numCol)].map(_ => [...Array(this.numRow)].map(_ => new Set()));
        this.balls = new Set()
    }

    visualize() {
        const graphic = new PIXI.Graphics()
        graphic.lineStyle(1, 0xffffff)
        graphic.zIndex = 10
        for (let col = this.min[0]; col <= this.max[0]; col += this.cellSize[0]) {
            graphic.moveTo(col, this.min[1])
            graphic.lineTo(col, this.max[1])
        }
        for (let row = this.min[1]; row <= this.max[1]; row += this.cellSize[1]) {
            graphic.moveTo(this.min[0], row)
            graphic.lineTo(this.max[0], row)
        }
        app.stage.addChild(graphic)
    }

    insert(ball) {
        let col = Math.floor(ball.x / this.cellSize[0])
        let row = Math.floor(ball.y / this.cellSize[1])

        this.cells[col][row].add(ball)

    }
}

export { SpatialHash }
