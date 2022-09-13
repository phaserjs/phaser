var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cursors;
var a = 0;
var container;
var image;
var text;
var px = 400;
var py = 300;
var hit = false;
var gfx;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('land', 'assets/sprites/advanced_wars_land.png');
}

function create ()
{
    // var image = this.add.tileSprite(0, 0, 512, 256, 'mushroom');

    gfx = this.add.graphics();

    container = this.add.container(400, 300);

    //  child
    image = this.add.image(0, 0, 'land');
    container.add(image);

    //  stand-alone
    // image = this.add.image(400, 300, 'land');

    image.setInteractive();

    cursors = this.input.keyboard.createCursorKeys();

    var graphics = this.add.graphics();

    graphics.fillStyle(0xff0000);
    graphics.fillRect(px - 3, py - 3, 6, 6);

    this.input.on('pointerup', function (pointer) {

        px = pointer.x;
        py = pointer.y;

        graphics.clear();
        graphics.fillStyle(0xff0000);
        graphics.fillRect(px - 3, py - 3, 6, 6);

    });

    text = this.add.text(10, 10, 'Hit?', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    if (cursors.left.isDown)
    {
        container.angle--;
    }
    else if (cursors.right.isDown)
    {
        container.angle++;
    }

    var c = this.game.input.hitTest({ x: px, y: py }, [ image ], this.cameras.main);

    hit = (c.length === 1);

    text.setText([ 'Hit: ' + hit, 'Angle: ' + image.angle.toString(), 'Rot: ' + image._rotation, 'x/y: ' + px.toString() + ' x ' + py.toString() ]);

    gfx.clear();

    if (hit)
    {
        gfx.fillStyle(0x00ff00);
        gfx.fillRect(0, 500, 800, 600);
    }
    else
    {
        gfx.fillStyle(0xff0000);
        gfx.fillRect(0, 500, 800, 600);
    }
}
