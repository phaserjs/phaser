
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { create: create, update: update, render: render });

var line;
var setting = false;

function create() {

	line = new Phaser.Line(64, 64, 200, 300);

	game.input.onDown.add(click, this);

}

function update() {

	if (setting)
	{
		if (game.input.activePointer.isDown)
		{
			line.end.set(game.input.activePointer.x, game.input.activePointer.y);
		}
		else
		{
			setting = false;
		}
	}

}

function click(pointer) {

	setting = true;
	line.start.set(pointer.x, pointer.y);

}

function render() {

	game.debug.geom(line);
	game.debug.rectangle(line);

}
