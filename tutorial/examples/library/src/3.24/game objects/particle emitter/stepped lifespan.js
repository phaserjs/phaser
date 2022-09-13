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
        frame: 'red',
        x: 400, y: 300,
        lifespan: { min: 100, max: 2000, steps: 1000 },
        speed: 200,
        quantity: 1,
        scale: 0.4,
        blendMode: 'ADD'
    });
}
