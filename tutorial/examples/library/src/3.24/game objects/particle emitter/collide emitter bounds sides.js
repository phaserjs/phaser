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

    var emitter = particles.createEmitter({
        frame: [ 'red', 'green' ],
        x: 400,
        y: 400,
        lifespan: 4000,
        angle: { min: 225, max: 315 },
        speed: { min: 300, max: 500 },
        scale: { start: 0.6, end: 0 },
        gravityY: 300,
        bounce: 0.9,
        bounds: { x: 250, y: 0, w: 350, h: 0 },
        collideTop: false,
        collideBottom: false,
        blendMode: 'ADD'
    });
}
