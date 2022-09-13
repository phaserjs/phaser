var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var circle = new Phaser.Geom.Circle(0, 0, 180);

var weightedCircle = {
    getRandomPoint: function (vec)
    {
        var t = Phaser.Math.PI2 * Math.random();
        var r = Math.pow(Math.random(), -0.1);

        vec.x = circle.x + r * Math.cos(t) * circle.radius;
        vec.y = circle.y + r * Math.sin(t) * circle.radius;

        return vec;
    }
};

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: 'red',
        x: 400, y: 300,
        lifespan: 2000,
        quantity: 4,
        scale: 0.2,
        alpha: { start: 1, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'random', source: weightedCircle }

        // Compare:
        // emitZone: { type: 'random', source: circle }
    });
}
