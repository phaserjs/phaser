
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('einstein', 'assets/pics/bw-face.png');

}

var image;

function create() {

    image = game.add.image(0, 0, 'einstein', null, game.stage);

    //  Set the tint like this (topLeft, topRight, bottomLeft, bottomRight)
    // image.color.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

    // image.color.setTint(0xff00ff, 0x000000, 0x000000, 0xff0000);
    image.color.setTint(0xff00ff, 0xffffff, 0xffffff, 0xff0000);


    //  Or like this:

    // image.color.tintTopLeft = 0xff00ff;
    // image.color.tintTopRight = 0xffff00;
    // image.color.tintBottomLeft = 0x0000ff;
    // image.color.tintBottomRight = 0xff0000;

}
