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
        x: 64,
        y: { min: 500, max: 100, steps: 16 },
        lifespan: 4000,
        accelerationX: 200,
        scale: 0.4,
        frequency: 100
    });
}
