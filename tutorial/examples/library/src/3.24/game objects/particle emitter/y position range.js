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
        frame: 'blue',
        x: 64,
        y: { min: 100, max: 500 },
        lifespan: 2000,
        speedX: { min: 200, max: 400 },
        scale: { start: 0.4, end: 0 },
        quantity: 4,
        blendMode: 'ADD'
    });
}
