function Colour(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

Colour.prototype.toCanvasColour = function() {
    return 'rgb(' + parseInt(this.r) + ',' + parseInt(this.g) + ',' + parseInt(this.b) + ')';
};

Colour.prototype.interpolate = function(x, other) {
    return new Colour(
        this.r + (other.r - this.r) * x;
        this.g + (other.g - this.g) * x;
        this.b + (other.b - this.b) * x;
        this.a + (other.a - this.a) * x;
    )
};
