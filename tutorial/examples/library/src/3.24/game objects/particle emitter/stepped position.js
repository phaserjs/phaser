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
    this.load.image('bg', 'assets/ui/undersea-bg.png');
    this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
    this.add.image(400, 300, 'bg');

    var particles = this.add.particles('fish');

    particles.createEmitter({
        frame: { frames: [ 0, 1, 2 ], cycle: true },
        x: -70,
        y: { min: 100, max: 500, steps: 8 },
        lifespan: 5000,
        speedX: 200,
        frequency: 500
    });
}
