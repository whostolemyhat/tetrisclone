function ParticleSystem(params) {
    this.params = {
        pos: new Point(0, 0),
        particlesPerSecond: 100,
        particleLife: 0.5,
        lifeVariation: 0.52,
        // gradient of colours
        colours: new Gradient([new Colour(255, 255, 255, 1), new Colour(0, 0, 0, 0)]),
        // angles
        angle: 0,
        angleVariation: Math.PI * 2,
        minVelocity: 20,
        maxVelocity: 50,
        // gravity vector
        gravity: new Point(0, 30.8),
        collider: null,
        bounceDamper: 0.5
    };

    // if params supplied, override defaults
    for(var p in params) {
        this.params[p] = params[p];
    }

    this.particles = [];
}

ParticleSystem.prototype.step = function(frameTime) {
    var newParticlesThisFrame = this.params.particlesPerSecond * frameTime;
    for(var i = 0; i < newParticlesThisFrame; i++) {
        this.spawnParticle((1.0 + i) / newParticlesThisFrame * frameTime);
    }
};

ParticleSystem.prototype.spawnParticle = function(offset) {
    // fire particle at random angle/speed
    var angle = randVariation(this.params.angle, this.params.angleVariation);
    var speed = randRange(this.params.minVelocity, this.params.maxVelocity);
    var life = randVariation(this.params.particleLife, this.params.particleLife * this.params.lifeVariation);

    var velocity = new Point().fromPolar(Angle, speed);

    // create particles from offset so they don't all appear from same point
    var pos = this.params.pos.clone().add(velocity.times(offset));

    this.particles.push(new Particle(this.params, pos, velocity, life));
};
