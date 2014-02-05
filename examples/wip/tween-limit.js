
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('phaser', 'assets/sprites/phaser1.png');
	game.load.spritesheet('arrows', 'assets/sprites/arrows.png', 23, 31);

}

var arrowStart;
var arrowEnd;
var sprite;

function create() {

	game.stage.backgroundColor = '#2384e7';

	arrowStart = game.add.sprite(100, 100, 'arrows', 0);

	arrowEnd = game.add.sprite(400, 100, 'arrows', 1);

	sprite = game.add.sprite(100, 164, 'phaser');
	sprite.inputEnabled = true;

	sprite.events.onInputDown.add(move, this);

}

function move() {

	var tween = game.add.tween(sprite).to( { x: '+500' }, 3000, Phaser.Easing.Linear.None, true);

	tween.onComplete.add(over, this);

}

function over() {
	console.log('done');
	sprite.alpha = 0.5;
}

function update() {

	if (sprite.x > 200)
	{
		sprite.x = 200;
	}

}

function render() {


}
