function Shape() {
    this.x = 4;
    this.y = 0;
}

Shape.prototype.rotate = function() {
    var rotatedShape = {};
    rotatedShape.shape = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
};
