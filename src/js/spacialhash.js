import * as PIXI from 'pixi.js'
import { app } from './app'

class SpatialHash {
    constructor(bounds, cellsize) {
        this.min = bounds[0]
        this.max = bounds[1]
        this.cellsize = cellsize
        this.numCol = Math.floor((this.max[0] - this.min[0]) / this.cellsize[0])
        this.numRow = Math.floor((this.max[1] - this.min[1]) / this.cellsize[1])
        this.cells = [...Array(this.numCol)].map(_ => [...Array(this.numRow)].map(_ => new Set()));
    }

    resetHash(bounds, cellsize) {
        this.min = bounds[0]
        this.max = bounds[1]
        this.cellsize = cellsize
        this.numCol = Math.floor((this.max[0] - this.min[0]) / this.cellsize[0])
        this.numRow = Math.floor((this.max[1] - this.min[1]) / this.cellsize[1])
        this.cells = [...Array(this.numCol)].map(_ => [...Array(this.numRow)].map(_ => []));
        this.balls = new Set()
    }

    visualize() {
        const graphic = new PIXI.Graphics()
        graphic.lineStyle(1, 0xffffff)
        graphic.zIndex = 10
        for (let col = this.min[0]; col <= this.max[0]; col += this.cellsize[0]) {
            graphic.moveTo(col, this.min[1])
            graphic.lineTo(col, this.max[1])
        }
        for (let row = this.min[1]; row <= this.max[1]; row += this.cellsize[1]) {
            graphic.moveTo(this.min[0], row)
            graphic.lineTo(this.max[0], row)
        }
        app.stage.addChild(graphic)
    }

    getCellIndex(x, y) {
        const col = Math.max(0, Math.min(this.numCol - 1, Math.floor(x / this.cellsize[0])))
        const row = Math.max(0, Math.min(this.numRow - 1, Math.floor(y / this.cellsize[1])))

        return [col, row]
    }

    insert(ball) {
        const min = this.getCellIndex(ball.x - ball.r, ball.y - ball.r)
        const max = this.getCellIndex(ball.x + ball.r, ball.y + ball.r)
        ball.cells.bounds = [min, max]

        for (let col = min[0]; col <= max[0]; col++)
            for (let row = min[1]; row <= max[1]; row++) {
                const cell = this.cells[col][row]
                cell.add(ball)
                ball.cells.push(cell)
            }
    }

    remove(ball) {
        for (let cell of ball.cells) cell.delete(ball)
        ball.cells = []
    }

    update(ball) {
        const [min1, max1] = ball.cells.bounds
        const min2 = this.getCellIndex(ball.x - ball.r, ball.y - ball.r)
        const max2 = this.getCellIndex(ball.x + ball.r, ball.y + ball.r)
        if (min1[0] === min2[0] && min1[1] === min2[1] && max1[0] === max2[0] && max1[1] === max2[1]) return

        this.remove(ball)
        this.insert(ball)
    }

}

export { SpatialHash }
