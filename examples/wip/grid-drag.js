
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('block', 'assets/sprites/block.png');

}

var grid = [];
var currentTile = new Phaser.Point();

function create() {

	//	The block.png is 95x95, so for this we'll create a little grid or it won't fit:

	for (var y = 0; y < 5; y++)
	{
		grid[y] = [];

		for (var x = 0; x < 5; x++)
		{
			// grid[y][x] = game.add.sprite(x * 95, y * 95, 'block');
			//	coz the grid is empty like
			grid[y][x] = null;
		}
	}

	var block1 = game.add.sprite(600, 100, 'block');
	block1.name = 'block1';
	block1.inputEnabled = true;
	block1.input.enableDrag(true);
	block1.events.onDragStop.add(dropBlock, this);

	var block2 = game.add.sprite(600, 300, 'block');
	block2.name = 'block2';
	block2.inputEnabled = true;
	block2.input.enableDrag(true);
	block2.events.onDragStop.add(dropBlock, this);

}

function dropBlock(sprite, pointer) {

	//	Convert the pointer into a grid location
    var x = this.game.math.snapToFloor(pointer.x, 95) / 95;
    var y = this.game.math.snapToFloor(pointer.y, 95) / 95;

	//	Bounds check it
	if (x >= 0 && x <= 4 && y >= 0 && y <= 4)
	{
		//	something in there already?
		if (grid[y][x] !== null)
		{
			//	This is very hacky - what you SHOULD do is have a Pipe object which has properties startX and startY or something, and snap back to those.
			if (sprite.name === 'block1')
			{
				game.add.tween(sprite).to( { x: 600, y: 100 }, 1000, Phaser.Easing.Linear.None, true);
			}
			else
			{
				game.add.tween(sprite).to( { x: 600, y: 300 }, 1000, Phaser.Easing.Linear.None, true);
			}
		}
		else
		{
			grid[y][x] = sprite;
			sprite.inputEnabled = false;
		}
	}

}

function update() {

	//	95 = width and height of the block.png
    currentTile.x = this.game.math.snapToFloor(game.input.x, 95) / 95;
    currentTile.y = this.game.math.snapToFloor(game.input.y, 95) / 95;

}

function render() {

	game.debug.text('Tile X: ' + currentTile.x + ' Y: ' + currentTile.y, 32, 32);
	
}