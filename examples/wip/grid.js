
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
			grid[y][x] = game.add.sprite(x * 95, y * 95, 'block');
		}
	}

	game.input.onDown.add(clickedBlock, this);

}

function clickedBlock() {

	//	Bounds check
	if (currentTile.x >= 0 && currentTile.x <= 4 && currentTile.y >= 0 && currentTile.y <= 4)
	{
		block = grid[currentTile.y][currentTile.x];
		block.alpha = 0.5;
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