var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
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
    sprite1 = this.add.image(600, 100, 'mushroom');
    this.physics.world.enable([ sprite1 ]);
    sprite1.body.setVelocity(-100, 200).setBounce(1, 1).setCollideWorldBounds(true);

    sprite2 = this.add.image(0, 0, 'mushroom');
    this.physics.world.enable([ sprite2 ]);
    sprite2.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);

    var container = this.add.container(200, 50, [ sprite2 ]);
}

function update ()
{
    this.physics.world.collide(sprite1, sprite2);
}
