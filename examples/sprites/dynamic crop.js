
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('trsi', 'assets/pics/trsipic1_lazur.jpg');
}

var pic;

function create() {

    pic = game.add.sprite(0, 0, 'trsi');

    pic.cropEnabled = true;

    pic.crop.width = 128;
    pic.crop.height = 128;

}

function update() {

    pic.x = game.input.x;
    pic.y = game.input.y;

    pic.crop.x = game.input.x;
    pic.crop.y = game.input.y;

}

function render() {

    game.debug.renderText('x: ' + game.input.x + ' y: ' + game.input.y, 32, 32);

}
