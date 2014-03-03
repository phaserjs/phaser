
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

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

	if (sprite.x === 100)
	{
		//	Here you'll notice we are using a relative value for the tween.
		//	You can specify a number as a string with either + or - at the start of it.
		//	When the tween starts it will take the sprites current X value and add +300 to it.

		game.add.tween(sprite).to( { x: '+300' }, 2000, Phaser.Easing.Linear.None, true);
	}
	else if (sprite.x === 400)
	{
		game.add.tween(sprite).to( { x: '-300' }, 2000, Phaser.Easing.Linear.None, true);
	}

}

function render() {

	if (sprite.x === 100 || sprite.x === 400)
	{
		game.debug.text('Click sprite to tween', 32, 32);
	}

	game.debug.text('x: ' + arrowStart.x, arrowStart.x, arrowStart.y - 4);
	game.debug.text('x: ' + arrowEnd.x, arrowEnd.x, arrowEnd.y - 4);

}
