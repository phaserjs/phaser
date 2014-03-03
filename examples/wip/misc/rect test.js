
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {


}

var body;
var tile;

function create() {

	body = { left: 386, top: 89, right: 412, bottom: 127 };
	tile = { x: 416, y: 96, right: 448, bottom: 128 };

	game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN]);

}

function tileIntersects (body, tile) {

    if (body.width <= 0 || body.height <= 0 || tile.width <= 0 || tile.height <= 0)
    {
        // return false;
    }

    var test1 = body.right < tile.x;
    var test2 = body.bottom < tile.y;
    var test3 = body.left > tile.right;
    var test4 = body.top > tile.bottom;

    result = !(body.right < tile.x || body.bottom < tile.y || body.left > tile.right || body.top > tile.bottom);

	// game.debug.text('intersects: ' + result, 32, 32);
	// game.debug.text('test 1: ' + test1, 320, 60);
	// game.debug.text('test 2: ' + test2, 320, 80);
	// game.debug.text('test 3: ' + test3, 320, 100);
	// game.debug.text('test 4: ' + test4, 320, 120);

    return result;

}

function update() {

	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	{
		body.left -= 1;
		body.right -= 1;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	{
		body.left += 1;
		body.right += 1;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	{
		body.top -= 1;
		body.bottom -= 1;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	{
		body.top += 1;
		body.bottom += 1;
	}

}

function render() {

	var r = tileIntersects(body, tile);

	game.context.fillStyle = 'rgb(255,0,0)';
	game.context.fillRect(body.left, body.top, body.right-body.left,body.bottom-body.top);

	game.context.fillStyle = 'rgb(0,255,0)';
	game.context.fillRect(tile.x, tile.y, tile.right-tile.x,tile.bottom-tile.y);

}
