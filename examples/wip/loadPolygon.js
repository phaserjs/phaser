
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('contra2', 'assets/pics/contra2.png');
	game.load.image('bunny', 'assets/sprites/bunny.png');
	game.load.image('tetrisblock1', 'assets/sprites/tetrisblock1.png');
	game.load.image('tetrisblock2', 'assets/sprites/tetrisblock2.png');
	game.load.image('tetrisblock3', 'assets/sprites/tetrisblock3.png');

	//	Load our physcs data exported from PhysicsEditor
	game.load.physics('physicsData', 'assets/physics/sprites.json');

}

var contra;
var start = false;

function create() {

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

	contra = game.add.sprite(400, 300, 'contra2');
	game.physics.enable(contra, Phaser.Physics.P2JS, true);
	contra.body.clearShapes();
	contra.body.loadPolygon('physicsData', 'contra2');

	game.input.onDown.add(function() { start = true; }, this);

}

function update() {

	if (start)
	{
		contra.body.rotateLeft(5);
	}

}

function render() {

}
