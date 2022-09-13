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
        frame: 'yellow',
        radial: false,
        x: 100,
        y: { min: 0, max: 560, steps: 256 },
        lifespan: 2000,
        speedX: { min: 200, max: 400 },
        quantity: 4,
        gravityY: -50,
        scale: { start: 0.6, end: 0, ease: 'Power3' },
        blendMode: 'ADD'
    });
}
