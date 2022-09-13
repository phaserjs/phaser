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

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    var shape1 = new Phaser.Geom.Circle(0, 0, 180);
    var shape2 = new Phaser.Geom.Circle(0, 0, 200);

    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: 'red',
        x: 400, y: 300,
        lifespan: 2000,
        quantity: 4,
        scale: 0.2,
        alpha: { start: 1, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'random', source: shape1 }
    });

    particles.createEmitter({
        frame: 'yellow',
        x: 400, y: 300,
        speed: 0,
        lifespan: 1000,
        quantity: 1,
        scale: { start: 0.4, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: shape2, quantity: 48, yoyo: false }
    });
}
