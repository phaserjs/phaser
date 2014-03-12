
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
	game.load.image('box', 'assets/sprites/block.png');

}

var box;
var box2;
var cursors;

function create() {

	//	If you're going to resize the world, it's easier to do it BEFORE enabling P2
    game.world.setBounds(0, 0, 1920, 1200);

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0.8;

    game.add.sprite(0, 0, 'backdrop');

	box = game.add.sprite(200, 200, 'box');
	box.name = 'bob';

	box2 = game.add.sprite(400, 200, 'box');
	box2.name = 'ben';

	game.physics.p2.enable([box, box2]);

	box2.body.setZeroDamping();
	box2.body.fixedRotation = true;

	game.camera.follow(box2);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

	box2.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
    	box2.body.moveLeft(400);
    }
    else if (cursors.right.isDown)
    {
    	box2.body.moveRight(400);
    }

    if (cursors.up.isDown)
    {
    	box2.body.moveUp(400);
    }
    else if (cursors.down.isDown)
    {
    	box2.body.moveDown(400);
    }

}

function render() {

}

