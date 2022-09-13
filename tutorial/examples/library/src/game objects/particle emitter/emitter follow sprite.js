var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 },
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
}

function create ()
{
    var particles = this.add.particles('megaset');

    var sprite = this.physics.add.image(300, 300, 'megaset', 'gem').setVelocity(300, 200).setBounce(1).setCollideWorldBounds(true);

    var sprite2 = this.physics.add.image(200, 200, 'megaset', 'ilkke').setVelocity(-300, -200).setBounce(1).setCollideWorldBounds(true);

    particles.createEmitter({
        frame: 'yellow_ball',
        speed: 100,
        gravity: { x: 0, y: 200 },
        scale: { start: 0.1, end: 1 },
        follow: sprite
    });

    //  You can also follow a sprite like this (rather than setting it in the config)

    var emitter = particles.createEmitter({
        frame: 'red_ball',
        speed: 100,
        gravity: { x: 0, y: 200 },
        scale: { start: 0.1, end: 1 },
    });

    emitter.startFollow(sprite2);
}
