var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var wall;
var sprite;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('flectrum', 'assets/sprites/flectrum.png');
}

function create ()
{
    wall = this.physics.add.image(200, 300, 'flectrum').setImmovable();

    sprite = this.physics.add.image(500, 300, 'mushroom').setVelocity(-100, 0).setBounce(1).setCollideWorldBounds(true);
}

function update ()
{
    this.physics.world.collide(wall, sprite, function () {
        console.log('hit?');
    });
}
