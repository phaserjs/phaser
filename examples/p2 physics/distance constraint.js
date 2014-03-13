
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('atari', 'assets/sprites/cokecan.png');
    game.load.image('ball', 'assets/sprites/red_ball.png');
	game.load.image('sky', 'assets/skies/cavern2.png');

}

var sprite1;
var sprite2;
var cursors;

function create() {

    game.add.image(0, 0, 'sky');

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

    //  Add 2 sprites which we'll join with a spring
    sprite1 = game.add.sprite(400, 300, 'ball');
	sprite2 = game.add.sprite(400, 400, 'atari');

	game.physics.p2.enable([sprite1, sprite2]);

    var constraint = game.physics.p2.createDistanceConstraint(sprite1, sprite2, 150);

    text = game.add.text(20, 20, 'move with arrow keys', { fill: '#ffffff' });

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

	sprite1.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
    	sprite1.body.moveLeft(400);
    }
    else if (cursors.right.isDown)
    {
    	sprite1.body.moveRight(400);
    }

    if (cursors.up.isDown)
    {
        sprite1.body.moveUp(400);
    }
    else if (cursors.down.isDown)
    {
        sprite1.body.moveDown(400);
    }

}

