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
    var tree = new Phaser.Geom.Triangle.BuildEquilateral(0, -250, 400);
    var trunk = new Phaser.Geom.Rectangle(0, 0, 80, 140);
    var baubles = new Phaser.Geom.Line(0, 0, 170, 60);
    var baubles2 = new Phaser.Geom.Line(0, 0, 310, 70);

    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: 'green',
        x: 400, y: 300,
        speed: 0,
        lifespan: 2000,
        delay: 2000,
        quantity: 48,
        frequency: 2000,
        delay: 500,
        scale: { start: 0.4, end: 0.1 },
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: tree, quantity: 48 }
    });

    particles.createEmitter({
        frame: 'blue',
        x: 360, y: 420,
        speed: 0,
        lifespan: 500,
        delay: 500,
        frequency: 0,
        quantity: 1,
        scale: 0.2,
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: trunk, quantity: 48 }
    });

    particles.createEmitter({
        frame: 'red',
        x: 400, y: 300,
        lifespan: 500,
        quantity: 1,
        frequency: 200,
        scale: 0.6,
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: tree, quantity: 12 }
    });

    particles.createEmitter({
        frame: { frames: [ 'red', 'yellow', 'blue' ], cycle: true },
        x: 340, y: 200,
        lifespan: 200,
        quantity: 1,
        frequency: 50,
        scale: 0.4,
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: baubles, quantity: 10 }
    });

    particles.createEmitter({
        frame: { frames: [ 'red', 'yellow', 'blue' ], cycle: true },
        x: 280, y: 300,
        lifespan: 200,
        quantity: 1,
        frequency: 50,
        scale: 0.4,
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: baubles2, quantity: 16 }
    });
}
