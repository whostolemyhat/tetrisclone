function Particle(params, pos, velocity, life) {
    this.pos = pos;
    this.velocity = velocity;
    this.life = life;
    this.maxLife = life;
    this.params = params;
}

Particle.prototype.step = function(frameTime) {
    var lastPos = this.pos.clone();

    this.velocity.add(this.params.gravity.times(frameTime));
    this.pos.add(this.velocity.time(frameTime));

    if(this.params.collider) {
        var intersect = this.params.collider.getIntersection(new Line(lastPos, this.pos));
        if(intersect != null) {
            this.pos = lastPos;
            this.velocity = intersect.reflect(this.velocity).times(this.params.bounceDamper);
        }
    }
    this.life -= frameTime;
};

Particle.prototype.draw = function(ctx, frameTime) {
    if(this.isDead()) {
        return;
    }

    var lifePercent = 1.0 - this.life / this.maxLife;
    var colour = this.params.colours.getColour(lifePercent);

    ctx.globalAlpha = colour.a;
    ctx.fillStyle = colour.toCanvasColour();
    ctx.fillRect(this.pos.x - 1, this.pos.y - 1, 3, 3);
};

Particle.prototype.isDead = function() {
    return this.life <= 0;
};
