
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false);

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var sprite;
var sprite2;
var g;
var p;

function create() {

	game.stage.backgroundColor = '#ff5500';

	sprite = game.add.sprite(0, -200, 'pic');

	// g = game.add.group(null, 'billy');

	// sprite2 = g.create(0, 0, 'pic');

	// g.y = 200;
	// g.rotation = 0.1;

	sprite2 = game.add.sprite(0, 300, 'pic');

	// game.input.onDown.add(tint, this);

	game.add.tween(sprite).to({y: 500}, 3000, Phaser.Easing.Linear.None, true);

	p = new PIXI.Point(43, 45);

}

function tint() {

	// sprite.tint = Math.random() * 0xFFFFFF;
	// sprite2.tint = Math.random() * 0xFFFFFF;

}

function update() {


}

function render() {

	// game.debug.text(sprite.position.y, 32, 32);

}
