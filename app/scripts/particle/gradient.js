function Gradient(colours) {
    this.colours = colours;
}

Gradient.prototype.getColour = function(percent, other) {
    var colourF = percent * (this.colours.length - 1);
    var colour1 = parseInt(colourF);
    var colour2 = parseInt(colourF + 1);

    return this.colours[colour1].interpolate(
        (colourF - colour1) / (colour2 - colour1),
        this.colours[colour2]
        );
};
