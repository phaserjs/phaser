var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
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
var graphics;
var cursors;
var text;
var moveCam = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/pics/uv-grid-diag.png');
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(-1024, -1024, 1024 * 2, 1024 * 2);
    this.physics.world.setBounds(-1024, -1024, 1024 * 2, 1024 * 2);

    this.add.image(-1024, -1024, 'bg').setOrigin(0);
    this.add.image(0, -1024, 'bg').setOrigin(0);
    this.add.image(-1024, 0, 'bg').setOrigin(0);
    this.add.image(0, 0, 'bg').setOrigin(0);

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(0, 0, 'block');

    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player, true);

    // this.cameras.main.setDeadzone(400, 200);
    // this.cameras.main.setZoom(0.5);

    if (this.cameras.main.deadzone)
    {
        graphics = this.add.graphics().setScrollFactor(0);
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(200, 200, this.cameras.main.deadzone.width, this.cameras.main.deadzone.height);
    }

    text = this.add.text(32, 32).setScrollFactor(0).setFontSize(32).setColor('#ffffff');;
}

function update ()
{
    var cam = this.cameras.main;

    if (cam.deadzone)
    {
        text.setText([
            'ScrollX: ' + cam.scrollX,
            'ScrollY: ' + cam.scrollY,
            'MidX: ' + cam.midPoint.x,
            'MidY: ' + cam.midPoint.y,
            'deadzone left: ' + cam.deadzone.left,
            'deadzone right: ' + cam.deadzone.right,
            'deadzone top: ' + cam.deadzone.top,
            'deadzone bottom: ' + cam.deadzone.bottom
        ]);
    }
    else
    {
        text.setText([
            'ScrollX: ' + cam.scrollX,
            'ScrollY: ' + cam.scrollY,
            'MidX: ' + cam.midPoint.x,
            'MidY: ' + cam.midPoint.y
        ]);
    }

    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-300);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(300);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-300);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(300);
    }
}