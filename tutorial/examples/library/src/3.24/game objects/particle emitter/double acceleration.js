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

    particles.createEmitter({
        frame: { frames: [ 'red', 'blue', 'green', 'yellow' ], cycle: true },
        x: 400,
        y: { min: 0, max: 632, steps: 32 },
        lifespan: 2000,
        accelerationX: 300,
        scale: 0.5,
        blendMode: 'ADD'
    });

    particles.createEmitter({
        frame: { frames: [ 'red', 'blue', 'green', 'yellow' ], cycle: true },
        x: 400,
        y: { min: 600, max: -32, steps: 32 },
        lifespan: 2000,
        accelerationX: -300,
        scale: 0.5,
        blendMode: 'ADD'
    });
}
