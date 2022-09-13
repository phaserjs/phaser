var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
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
    this.load.image('bg', 'assets/pics/backscroll.png');
    this.load.image('block', 'assets/sprites/crate32.png');
}

function create ()
{
    this.cameras.main.setBounds(0, 0, 720 * 2, 176);

    for (x = 0; x < 2; x++)
    {
        this.add.image(720 * x, 0, 'bg').setOrigin(0);
    }

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(400, 100, 'block');

    this.cameras.main.startFollow(player, true);
    this.cameras.main.setZoom(2);

    if (this.cameras.main.deadzone)
    {
        graphics = this.add.graphics().setScrollFactor(0);
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(200, 200, this.cameras.main.deadzone.width, this.cameras.main.deadzone.height);
    }

    text = this.add.text(220, 240).setScrollFactor(0).setFontSize(16).setColor('#ffffff');;
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
            'tb w: ' + cam._tb.width,
            'tb h: ' + cam._tb.height,
            'tb b: ' + cam._tb.bottom
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
            player.setVelocityX(-400);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(400);
        }
    
        if (cursors.up.isDown)
        {
            player.setVelocityY(-400);
        }
        else if (cursors.down.isDown)
        {
            player.setVelocityY(400);
        }
    }
}