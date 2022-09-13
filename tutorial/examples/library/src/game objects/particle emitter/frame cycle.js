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
    this.load.spritesheet('diamonds', 'assets/sprites/diamonds32x24x5.png', { frameWidth: 32, frameHeight: 24 });
}

function create ()
{
    var shape1 = new Phaser.Geom.Circle(0, 0, 200);

    var particles = this.add.particles('diamonds');

    particles.createEmitter({
        frame: { frames: [ 0, 1, 2, 3, 4 ], cycle: true, quantity: 32 },
        _frame: { frames: [ 0, 1, 2, 3, 4 ], cycle: true },
        _frame: { frames: [ 0, 1 ], cycle: true },
        _frame: { frames: [ 0, 1 ], cycle: true },
        x: 400,
        y: 300,
        frequency: 32,
        lifespan: 400,
        alpha: { start: 1, end: 0 },
        zone: { type: 'edge', source: shape1, quantity: 32 }
    });
}
