
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    this.load.image('logo', 'assets/sprites/32x32.png');

}

var block;

function create() {

    block = this.add.image(0, 300, 'logo');

    block.transform.enableInterpolation();

}

function update() {

    if (block.x < 500)
    {
        block.x += 10;
    }
    else
    {
        block.transform.disableInterpolation();
    }

}