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
    this.load.image('crate', 'assets/sprites/crate.png');
}

function create ()
{
    var particles = this.add.particles('crate');

    var emitter = particles.createEmitter();

    emitter.setPosition(400, 300);
    emitter.setSpeed(200);
    emitter.setLifespan(3000);
    emitter.setScale(0.5);

    /*
    var emitter = particles.createEmitter({
        x: 400, y: 300,
        lifespan: 3000,
        speed: 200,
        quantity: 1,
        scale: 0.5
    });

    //  Overrides the 0.5 scale set in the config object above
    emitter.setScale(2);
    */
}
