var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;
var player;
var group;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('chunk', 'assets/sprites/space-baddie.png');
    this.load.image('crate', 'assets/sprites/crate.png');
}

function create ()
{
    this.physics.world.setBounds(0, 0, 800 * 1, 600 * 1);

    var bounds = new Phaser.Geom.Rectangle(30, 30, 300, 540);

    group = this.physics.add.group({ immovable: true });

    for (var i = 0; i < 50; i++)
    {
        var pos = bounds.getRandomPoint();

        group.create(pos.x, pos.y, 'chunk');
    }

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(600, 300, 'crate');

    this.physics.add.collider(player, group);
}

function update ()
{
    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-500);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(500);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-500);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(500);
    }
}
