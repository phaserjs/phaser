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

    var well = particles.createGravityWell({
        x: 400,
        y: 300,
        power: 3,
        epsilon: 100,
        gravity: 100
    });

    var emitter = particles.createEmitter({
        frame: [ 'red', 'green' ],
        x: 600,
        y: 400,
        lifespan: 4000,
        speed: 200,
        scale: { start: 0.7, end: 0 },
        blendMode: 'ADD'
    });
}
