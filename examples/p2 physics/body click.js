
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('contra2', 'assets/pics/contra2.png');
	game.load.image('bunny', 'assets/sprites/bunny.png');
	game.load.image('block', 'assets/sprites/block.png');
	game.load.image('wizball', 'assets/sprites/wizball.png');

	game.load.physics('physicsData', 'assets/physics/sprites.json');

}

var contra;
var bunny;
var block;
var wizball;

var result = 'Click a body';

function create() {

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

	contra = game.add.sprite(100, 200, 'contra2');
	bunny = game.add.sprite(550, 200, 'bunny');
	block = game.add.sprite(300, 400, 'block');
	wizball = game.add.sprite(500, 500, 'wizball');

	//	Enable the physics bodies on all the sprites and turn on the visual debugger
	game.physics.p2.enable([ contra, bunny, block, wizball ], true);

	//	Convex polys
	contra.body.clearShapes();
	contra.body.loadPolygon('physicsData', 'contra2');

	bunny.body.clearShapes();
	bunny.body.loadPolygon('physicsData', 'bunny');

	//	Circle
	wizball.body.setCircle(45);

	game.input.onDown.add(click, this);

}

function click(pointer) {

	//	You can hitTest against an array of Sprites, an array of Phaser.Physics.P2.Body objects, or don't give anything
	//	in which case it will check every Body in the whole world.

	var bodies = game.physics.p2.hitTest(pointer.position, [ contra, bunny, block, wizball ]);

	if (bodies.length === 0)
	{
		result = "You didn't click a Body";
	}
	else
	{
		result = "You clicked: ";

		for (var i = 0; i < bodies.length; i++)
		{
			//	The bodies that come back are p2.Body objects.
			//	The parent property is a Phaser.Physics.P2.Body which has a property called 'sprite'
			//	This relates to the sprites we created earlier.
			//	The 'key' property is just the texture name, which works well for this demo but you probably need something more robust for an actual game.
			result = result + bodies[i].parent.sprite.key;

			if (i < bodies.length - 1)
			{
				result = result + ', ';
			}
		}

	}

}

function update() {

	bunny.body.rotateLeft(2);

}

function render() {

	game.debug.text(result, 32, 32);

}
