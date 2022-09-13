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
    // this.load.image('bg', 'assets/pics/the-end-by-iloe-and-made.jpg');
    this.load.image('bg', 'assets/pics/uv-grid-diag.png');
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    // this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
    // this.cameras.main.setBounds(0, 0, 1024 * 4, 1024 * 4);
    // this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);

    //  Mash 4 images together to create our background
    // this.add.image(0, 0, 'bg').setOrigin(0);
    // this.add.image(1920, 0, 'bg').setOrigin(0).setFlipX(true);
    // this.add.image(0, 1080, 'bg').setOrigin(0).setFlipY(true);
    // this.add.image(1920, 1080, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

    this.cameras.main.setBounds(0, 0, 1024 * 4, 1024 * 4);

    for (y = 0; y < 4; y++)
    {
        for (x = 0; x < 4; x++)
        {
            this.add.image(1024 * x, 1024 * y, 'bg').setOrigin(0).setAlpha(0.75);
        }
    }

    cursors = this.input.keyboard.createCursorKeys();

    // player = this.physics.add.image(1920, 1080, 'block');
    // player = this.physics.add.image(1024, 1024, 'block');
    // player = this.physics.add.image(10, 10, 'block');
    player = this.physics.add.image(1024, 1024, 'block');

    // player.setCollideWorldBounds(true);

    // this.cameras.main.setZoom(0.5);
    // this.cameras.main.setDeadzone(400, 200);

    this.cameras.main.startFollow(player, true);
    // this.cameras.main.startFollow(player, true, 0.1, 0.1);

    this.cameras.main.setDeadzone(400, 200);
    this.cameras.main.setZoom(0.5);

    this.input.on('pointerdown', function () {
        moveCam = (moveCam) ? false: true;
    });

    if (this.cameras.main.deadzone)
    {
        graphics = this.add.graphics().setScrollFactor(0);
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(200, 200, this.cameras.main.deadzone.width, this.cameras.main.deadzone.height);
    }

    text = this.add.text(32, 32).setScrollFactor(0).setFontSize(64).setColor('#ffffff');;
}

function update ()
{
    var cam = this.cameras.main;

    if (cam.deadzone)
    {
        text.setText([
            'Cam Control: ' + moveCam,
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
    else if (cam._tb)
    {
        text.setText([
            'Cam Control: ' + moveCam,
            'ScrollX: ' + cam.scrollX,
            'ScrollY: ' + cam.scrollY,
            'MidX: ' + cam.midPoint.x,
            'MidY: ' + cam.midPoint.y,
            'tb x: ' + cam._tb.x,
            'tb y: ' + cam._tb.y,
            'tb right: ' + cam._tb.right,
            'tb bottom: ' + cam._tb.bottom
        ]);
    }

    player.setVelocity(0);

    if (moveCam)
    {
        if (cursors.left.isDown)
        {
            cam.scrollX -= 4;
        }
        else if (cursors.right.isDown)
        {
            cam.scrollX += 4;
        }
    
        if (cursors.up.isDown)
        {
            cam.scrollY -= 4;
        }
        else if (cursors.down.isDown)
        {
            cam.scrollY += 4;
        }
    }
    else
    {
        if (cursors.left.isDown)
        {
            player.setVelocityX(-800);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(800);
        }
    
        if (cursors.up.isDown)
        {
            player.setVelocityY(-800);
        }
        else if (cursors.down.isDown)
        {
            player.setVelocityY(800);
        }
    }
}