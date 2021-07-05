function add(point1, point2) {
    const newPoint = point1.clone()
    newPoint.set(point1.x + point2.x, point1.y + point2.y)
    return newPoint
}

function sub(point1, point2) {
}

function scale(point, k) {
}

function dot(point1, point2) {
}

function magnitude(point) {
}

function normalize(point, k = 1) {
}

export { add, sub, scale, dot, magnitude, normalize }
