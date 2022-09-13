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
    this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
    var particles = this.add.particles('fish');

    var emitter = particles.createEmitter({
        frame: 1,
        x: { min: 0, max: 800 },
        y: 100,
        gravityY: 200,
        lifespan: { min: 1500, max: 3000 },
        maxAliveParticles: 16,
        quantity: 4
    });
}
