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
        frame: 'green',
        x: 100,
        y: 300,
        lifespan: 2000,
        speedX: { min: 100, max: 400, steps: 12 },
        speedY: { min: -20, max: 20 },
        scale: { start: 0.7, end:  0.2 },
        blendMode: 'ADD'
    });
}
