var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/p2.jpg');
    this.load.image('box', 'assets/sprites/steelbox.png');
    this.load.image('bg', 'assets/tests/32pxstrip.png');
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    var block = this.physics.add.image(400, 300, 'block').setImmovable(true).setName('big');

    //  Allow entrance through the top-face only
    // block.body.setCheckCollisionUp(false);

    player = this.physics.add.image(100, 300, 'box').setName('small');

    // this.physics.add.collider(block, player);

    this.physics.add.collider(player, block);

    cursors = this.input.keyboard.createCursorKeys();
}

function update (time)
{
    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-200);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(200);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-200);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(200);
    }
}
