import * as PIXI from 'pixi.js'
import { app } from './app'

class SpatialGrid {
    constructor(bounds, cellsize) {
        this.min = bounds[0]
        this.max = bounds[1]
        this.cellsize = cellsize
        this.numCol = (this.max[0] - this.min[0]) / this.cellsize[0]
        this.numRow = (this.max[1] - this.min[1]) / this.cellsize[1]
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

    clear() {
        for (let col in this.cells)
            for (let row in this.cells[col])
                this.cells[col][row] = []
    }

    getCellIndex(x, y) {
        const col = Math.max(0, Math.min(this.numCol - 1, Math.floor(x / this.cellsize[0])))
        const row = Math.max(0, Math.min(this.numRow - 1, Math.floor(y / this.cellsize[1])))

        return [col, row]
    }

    insert(ball) {
        const min = this.getCellIndex(ball.x - ball.r, ball.y - ball.r)
        const max = this.getCellIndex(ball.x + ball.r, ball.y + ball.r)
        const [col, row] = this.getCellIndex(ball.x, ball.y)

        for (let col = min[0]; col <= max[0]; col++)
            for (let row = min[1]; row <= max[1]; row++) {
                const cell = this.cells[col][row]
                cell.push(ball)
                ball.cells.push(cell)
            }
    }

    update(ball) {
        [min1, max1] = ball.cells.bounds
        const min2 = this.getCellIndex(ball.x - ball.r, ball.y - ball.r)
        const max2 = this.getCellIndex(ball.x + ball.r, ball.y + ball.r)
        if (min1[0] === min2[0] && min1[1] === min2[1]) return

        ball.cells = []
        for (let col = min2[0]; col <= max2[0]; col++)
            for (let row = min2[1]; row <= max2[1]; row++) {
                const cell = this.cells[col][row]
                cell.push(ball)
                ball.cells.push(cell)
            }
    }

}

export { SpatialGrid }
