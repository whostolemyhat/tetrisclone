function Particle(params, pos, velocity, life) {
    this.pos = pos;
    this.velocity = velocity;
    this.life = life;
    this.maxLife = life;
    this.params = params;
}

Particle.prototype.step = function(frameTime) {
    // console.log('particle step');
    var lastPos = this.pos.clone();

    // this.velocity.add(this.params.gravity.times(frameTime));
    // this.pos.add(this.velocity.times(frameTime));

    // if(this.params.collider) {
    //     var intersect = this.params.collider.getIntersection(new Line(lastPos, this.pos));
    //     if(intersect != null) {
    //         this.pos = lastPos;
    //         this.velocity = intersect.reflect(this.velocity).times(this.params.bounceDamper);
    //     }
    // }
    this.life -= frameTime;
};

Particle.prototype.draw = function(ctx, frameTime) {
    // console.log('drawing');
    if(this.isDead()) {
        return;
    }

    var lifePercent = 1.0 - this.life / this.maxLife;
    var colour = this.params.colours.getColour(lifePercent);

    ctx.globalAlpha = colour.a;
    ctx.fillStyle = colour.toCanvasColour();
    ctx.fillRect(this.pos.x, this.pos.y, 3, 3);
};

Particle.prototype.isDead = function() {
    return this.life <= 0;
};
