var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var atari1;
var atari2;
var atari3;
var hitarea1;
var hitarea2;
var rotation = 0.005;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('atari1', 'assets/sprites/atari130xe.png');
    this.load.image('atari2', 'assets/sprites/atari130xe-input.png');
}

function create ()
{
    //  The texture is 220 x 104 pixels in size.

    //  By default, `setInteractive` will create a Rectangle with
    //  a position of 0 x 0 and a size of 220 x 104:
    atari1 = this.add.image(150, 300, 'atari1').setInteractive();

    //  For this one, we'll change it so that the hit area is only over
    //  the keyboard part of the image (i.e. a smaller hit area than the texture size):
    atari2 = this.add.image(400, 300, 'atari2').setInteractive();

    //  The 18 x 51 is the coordinate from the top-left of the texture
    //  The 183 x 39 is the width and height of the hit area rectangle
    atari2.input.hitArea.setTo(18, 51, 183, 39);

    //  For this one, we'll change it so that the hit area is 60px bigger than the texture on each side
    atari3 = this.add.image(650, 300, 'atari1').setInteractive();

    //  Coordinates are relative from the top-left, so we want out hit area to be
    //  an extra 60 pixels around the texture, so -30 from the x/y and + 60 to the texture width and height
    atari3.input.hitArea.setTo(-30, -30, 220 + 60, 104 + 60);

    //  Debug output:
    var text = this.add.text(10, 10, 'Click to toggle rotation\nMouse over the hit areas', { font: '16px Courier', fill: '#00ff00' });

    atari1.on('pointerover', function () { text.setText('Over Image 1'); });
    atari1.on('pointerout', function () { text.setText(''); });

    atari2.on('pointerover', function () { text.setText('Over Image 2'); });
    atari2.on('pointerout', function () { text.setText(''); });

    atari3.on('pointerover', function () { text.setText('Over Image 3'); });
    atari3.on('pointerout', function () { text.setText(''); });


    //  Draw the hit areas to a graphics object so we can visualize it:
    hitarea1 = this.add.rectangle(atari1.x, atari1.y, atari1.width, atari1.height, 0x00ff00, 0.5);
    hitarea2 = this.add.rectangle(atari3.x, atari3.y, atari3.width + 60, atari3.height + 60, 0xff00ff, 0.5);

    this.input.on('pointerdown', function () {

        rotation = (rotation === 0) ? 0.005 : 0;

    });
}

function update ()
{
    atari1.rotation += rotation;
    atari2.rotation += rotation;
    atari3.rotation += rotation;
    
    hitarea1.rotation += rotation;
    hitarea2.rotation += rotation;
}
