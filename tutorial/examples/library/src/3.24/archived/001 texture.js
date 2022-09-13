
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('einstein', 'assets/pics/ra_einstein.png');

}

var texture;
var frame;
var x = 64;
var y = 32;

function create() {

    // texture = game.textures.addImage('einstein', game.cache.getImage('einstein'));

    frame = game.textures.getFrame('einstein');

    // console.log(texture);
    console.log(frame);

}

function render () {

    game.context.drawImage(
        frame.source.image,
        frame.cutX,
        frame.cutY,
        frame.cutWidth,
        frame.cutHeight,
        x,
        y,
        frame.cutWidth,
        frame.cutHeight
    );

}
