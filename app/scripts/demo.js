var psAngle = 0;
var ps = new ParticleSystem({
    particlesPerSecond: 20,
    particleLife: 10.0,
    colors: new Gradient([ new Colour(255, 0, 0, 1), new Colour(255, 0, 255, 1), new Colour(0, 0, 255, 0.5), new Colour(0, 0, 127, 0)]),
    pos: new Point(Board.width / 2, Board.height / 2),
    angle: Math.PI / 2,
    angleVariation: 0.6 
});

var lastTime = new Date().getTime();

var draw = function() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    var currTime = new Date().getTime();
    var frameTime = (currTime - lastTime) / 1000.0;
    ps.draw(ctx, frameTime);
};

var update = function() {

    var currTime = new Date().getTime();
    var frameTime = (currTime - lastTime) / 1000.0;
    ps.step(frameTime);
    
    psAngle += frameTime;
    ps.params.angle += 0.5 * Math.PI * 1.0 / 60 + frameTime;
    ps.params.pos = new Point(Math.cos(psAngle) * (CANVAS_WIDTH / 2) + CANVAS_WIDTH / 2, CANVAS_HEIGHT / 10);
    ps.params.angle += 0.5 * Math.PI * 1.0 / 60 + frameTime;
};
