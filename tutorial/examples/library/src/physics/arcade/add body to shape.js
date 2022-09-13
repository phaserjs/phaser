var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        create: create,
        update: update
    }
};

var cursors;
var player;

var game = new Phaser.Game(config);

function create ()
{
    player = this.add.rectangle(400, 300, 64, 64, 0xffffff);

    this.physics.add.existing(player, false);

    cursors = this.input.keyboard.createCursorKeys();

    player.body.setCollideWorldBounds(true);
}

function update ()
{
    player.body.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-300);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(300);
    }

    if (cursors.up.isDown)
    {
        player.body.setVelocityY(-300);
    }
    else if (cursors.down.isDown)
    {
        player.body.setVelocityY(300);
    }
}
