
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var group;
var group2;

var atari;
var coke;
var dropper;

function create() {

	//	make our world wider
	game.world.setBounds(0, 0, 2000, 600);

	//	shift the camera (still works)
	// game.camera.x = 400;
	game.world.angle = 10;

	//	base group
	group = game.add.group();
	// group.angle = 10;
	group.y = 200;

	atari = group.create(0, 0, 'atari1');
	coke = group.create(340, 0, 'coke');

	//	dropper group
	group2 = game.add.group();

	dropper = group2.create(400, 0, 'mushroom');
    dropper.inputEnabled = true;
    dropper.input.enableDrag();
    dropper.events.onDragStop.add(checkDrop, this);

	group2.y = 400;

}

function checkDrop() {

	if (Phaser.Rectangle.intersects(dropper.body, atari.body))
	{
		atari.alpha = 0.3;
	}
	else if (Phaser.Rectangle.intersects(dropper.body, coke.body))
	{
		coke.alpha = 0.3;
	}

}

function update() {

	group.x += 0.5;

}

function render() {

	game.debug.text(dropper.position.x, 200, 32);
	game.debug.text(dropper.position.y, 260, 32);

	game.debug.geom(atari.body, 'rgba(255,0,0,0.3)');
	game.debug.geom(coke.body, 'rgba(255,0,0,0.3)');
	game.debug.geom(dropper.body, 'rgba(0,255,0,0.3)');

}
