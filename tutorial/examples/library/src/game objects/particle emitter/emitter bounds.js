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
    var particles = this.add.particles('flares');

    var rect = new Phaser.Geom.Rectangle(100, 100, 600, 400);

    particles.createEmitter({
        frame: [ 'red', 'yellow', 'green' ],
        x: 400, y: 300,
        lifespan: 4000,
        speed: { min: 100, max: 250 },
        scale: { start: 0.4, end: 0 },
        gravityY: 150,
        bounce: 0.8,
        bounds: rect,
        blendMode: 'ADD'
    });

    particles.createEmitter({
        frame: 'blue',
        lifespan: 1000,
        scale: { start: 0.4, end: 0 },
        emitZone: { type: 'edge', source: rect, quantity: 60 }
    });
}
