var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/pics/the-end-by-iloe-and-made.jpg');
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
    this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);

    //  Mash 4 images together to create our background
    this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.image(1920, 0, 'bg').setOrigin(0).setFlipX(true);
    this.add.image(0, 1080, 'bg').setOrigin(0).setFlipY(true);
    this.add.image(1920, 1080, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(400, 300, 'block');

    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player, true, 0.05, 0.05);

    text = this.add.text(10, 10, 'Cursors to move', { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);
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

    text.setText([
        'screen x: ' + this.input.x,
        'screen y: ' + this.input.y,
        'world x: ' + this.input.mousePointer.worldX,
        'world y: ' + this.input.mousePointer.worldY
    ]);
}
