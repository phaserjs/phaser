
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('contra2', 'assets/pics/contra2.png');
	game.load.image('bunny', 'assets/sprites/bunny.png');
	game.load.image('tetrisblock1', 'assets/sprites/tetrisblock1.png');
	game.load.image('tetrisblock2', 'assets/sprites/tetrisblock2.png');
	game.load.image('tetrisblock3', 'assets/sprites/tetrisblock3.png');

	//	Load our physics data exported from PhysicsEditor
	game.load.physics('physicsData', 'assets/physics/sprites.json');

}

var contra;
var bunny;
var tetris1;
var tetris2;
var tetris3;

var start = false;

function create() {

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

    //  Make things a bit more bouncey
    game.physics.p2.defaultRestitution = 0.8;

	contra = game.add.sprite(100, 200, 'contra2');
	bunny = game.add.sprite(500, 250, 'bunny');
	tetris1 = game.add.sprite(100, 400, 'tetrisblock1');
	tetris2 = game.add.sprite(300, 450, 'tetrisblock2');
	tetris3 = game.add.sprite(600, 450, 'tetrisblock3');

	//	Enable the physics bodies on all the sprites and turn on the visual debugger
	game.physics.p2.enable([ contra, bunny, tetris1, tetris2, tetris3 ], true);

	//	Clear the shapes and load the 'contra2' polygon from the physicsData JSON file in the cache
	contra.body.clearShapes();
	contra.body.loadPolygon('physicsData', 'contra2');

	bunny.body.clearShapes();
	bunny.body.loadPolygon('physicsData', 'bunny');

	tetris1.body.clearShapes();
	tetris1.body.loadPolygon('physicsData', 'tetrisblock1');

	tetris2.body.clearShapes();
	tetris2.body.loadPolygon('physicsData', 'tetrisblock2');

	tetris3.body.clearShapes();
	tetris3.body.loadPolygon('physicsData', 'tetrisblock3');

	//	Just starts it rotating
	game.input.onDown.add(boom, this);

}

function boom() {

	if (game.input.activePointer.x > tetris1.x)
	{
		tetris1.body.rotateLeft(200);
	}
	else
	{
		tetris1.body.rotateRight(200);
	}

	if (game.input.activePointer.y < tetris1.y)
	{
		tetris1.body.moveForward(400);
	}
	else
	{
		tetris1.body.moveBackward(400);
	}

}

function update() {
}

function render() {
}
