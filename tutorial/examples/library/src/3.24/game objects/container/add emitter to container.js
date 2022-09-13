var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('lemming', 'assets/sprites/lemming.png');
}

function create ()
{
    //  Our container
    var container = this.add.container(400, 300);

    //  Our emitter
    var particles = this.add.particles('lemming');

    var emitter = particles.createEmitter({
        x: 0,
        y: 0,
        lifespan: 2000,
        speed: { min: 200, max: 400 },
        angle: 330,
        gravityY: 300
    });

    container.add(particles);

    //  Rotate the container
    this.tweens.add({
        targets: container,
        angle: 360,
        duration: 6000,
        yoyo: true,
        repeat: -1
    });
}
