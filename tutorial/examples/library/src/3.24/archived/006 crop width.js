
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    this.load.image('scroll', 'assets/pics/backscroll.png');

}

var c = 0;
var pic;

function create() {

    pic = this.add.image(0, 0, 'scroll');

    Phaser.TextureCrop(pic, 0);

}

function update ()
{
    c++;

    if (c === pic.frame.realWidth)
    {
        c = 0;
    }

    Phaser.TextureCrop(pic, c);
}
