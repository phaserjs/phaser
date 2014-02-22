
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var text;
var b;
var grd;

function create() {

	game.stage.setBackgroundColor(0x2d2d2d);

    text = game.add.text(0, 0, "time");

}

function update() {


}

function render() {


}
