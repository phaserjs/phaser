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

    var circle = new Phaser.Geom.Circle(400, 300, 530);

    var emitter = particles.createEmitter({
        frame: { frames: [ 'red', 'green', 'blue' ], cycle: true, quantity: 32*4 },
        x: 0,
        y: 0,
        moveToX: 400,
        moveToY: 300,
        lifespan: 1000,
        quantity: 4,
        scale: { start: 0.8, end: 0.2 },
        delay: 1000,
        blendMode: 'ADD',
        emitZone: { source: circle, type: 'edge', quantity: 32 }
    });

    console.log(emitter);
}
