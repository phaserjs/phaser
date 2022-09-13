var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite1;
var sprite2;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

function create ()
{
    sprite1 = this.add.image(100, 100, 'mushroom');
    sprite2 = this.add.image(400, 100, 'mushroom');

    this.physics.world.enable([ sprite1, sprite2 ]);

    sprite1.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
    sprite2.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
}

function update ()
{
    this.physics.world.collide(sprite1, sprite2);
}
