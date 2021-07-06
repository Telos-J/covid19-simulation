class SpatialGrid {
    constructor(bounds, dimensions) {
        const [min, max] = bounds
        const [width, height] = dimensions
        this.bounds = bounds
        this.dimensions = dimensions
        this.cells = [...Array(width)].map(_ => [...Array(height)].map(_ => []));
        this.cellsize = [(max[0] - min[0]) / width, (max[1] - min[1]) / height]
        this.balls = new Set()
    }

    clear() {
        for (let col in this.cells)
            for (let row in this.cells[col])
                this.cells[col][row] = []
    }

    getCellIndex(x, y) {
        const col = Math.floor(x / this.cellsize[0])
        const row = Math.floor(y / this.cellsize[1]) 
        return [col, row]
    }

    insert(ball) {
        const min = this.getCellIndex(ball.x - ball.r, ball.y - ball.r)
        const max = this.getCellIndex(ball.x + ball.r, ball.y + ball.r)
        //ball.cells.bounds = [min, max]

        for (let col = min[0]; col <= max[0]; col++)
            for (let row = min[1]; row <= max[1]; row++) {
                const cell = this.cells[col]?.[row]
                if (cell) {
                cell.push(ball)
                ball.cells.push(cell)
                }
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
