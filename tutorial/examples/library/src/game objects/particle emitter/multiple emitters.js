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

    var emitter1 = particles.createEmitter({
        frame: 'blue',
        x: 400,
        y: 300,
        speed: 200,
        blendMode: 'ADD',
        lifespan: 1000
    });

    var emitter2 = particles.createEmitter({
        frame: 'red',
        x: 400,
        y: 300,
        speed: 200,
        scale: 0.5,
        blendMode: 'ADD',
        lifespan: 2000
    });

    var emitter3 = particles.createEmitter({
        frame: 'yellow',
        x: 400,
        y: 300,
        speed: 200,
        scale: { min: 0, max: 1 },
        blendMode: 'ADD',
        lifespan: 2500
    });

}
