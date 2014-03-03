
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('box', 'assets/sprites/block.png');

}

var box;
var move = false;
var start = 0;
var end = 0;

function create() {

	box = game.add.sprite(200, 200, 'box');
	box.physicsEnabled = true;

	//	Works
	// box.body.setPolygon({}, [	[-1, 1], [-1, 0], [1, 0], [1, 1], [0.5, 0.5]	]);

	//	Works
	// box.body.setPolygon({}, [-1, 1], [-1, 0], [1, 0], [1, 1], [0.5, 0.5]);

	//	Works
	// box.body.setPolygon({}, -100, 100, -100, 0, 100, 0, 100, 100, 50, 50);

	//	Works
	box.body.setPolygon({}, -1, 1, -1, 0, 1, 0, 1, 1, 0.5, 0.5);


        var path = [[-1, 1],
                    [-1, 0],
                    [1, 0],
                    [1, 1],
                    [0.5, 0.5]];

	// box.body.data.fromPolygon(path);

console.log('real path');
console.log(path);



	// box.body.setZeroDamping();

	// game.input.onDown.addOnce(startTiming, this);

}

function startTiming() {

	start = game.time.now;
	end = start + 1000;
	move = true;

}

function update() {

	if (move)
	{
		box.body.moveLeft(100);

		if (game.time.now >= end)
		{
			move = false;
			var duration = game.time.now - start;
			console.log('Test over. Distance: ', box.x, 'duration', duration);
		}
	}
	else
	{
		box.body.setZeroVelocity();
	}

}

function render() {

	game.debug.text('x: ' + box.body.velocity.x, 32, 32);
	game.debug.text('y: ' + box.body.velocity.y, 32, 64);

}
