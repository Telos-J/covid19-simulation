class SpatialHash {
    constructor(bounds, cellSize){
        this.numCol= (bounds[1][0]-bounds[0][0])/cellSize[0]
        this.numRow= (bounds[1][1]-bounds[0][1])/cellSize[1]
        this.cells = [...Array(this.numCol)].map(_ => [...Array(this.numRow)].map(_ => new Set()));
    }
    insert(ball){
        let col=Math.floor(ball.x/this.cellSize[0])
        let row=Math.floor(ball.y/this.cellSize[1])
    }
}

export{SpatialHash}