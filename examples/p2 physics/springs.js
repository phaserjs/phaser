
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
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
    sprite1 = game.add.sprite(200, 100, 'ball');
	sprite2 = game.add.sprite(200, 300, 'atari');

	game.physics.p2.enable([sprite1, sprite2]);

    //  Create our spring
    // var spring = game.physics.p2.createSpring(sprite1, sprite2, restLength, stiffness, damping, worldA, worldB, localA, localB);
    // var spring = game.physics.p2.createSpring(sprite1, sprite2);



    text = game.add.text(20, 20, 'move with arrow keys', { fill: '#ffffff' });

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

	// sprite.body.setZeroVelocity();

 //    if (cursors.left.isDown)
 //    {
 //    	sprite.body.moveLeft(400);
 //    }
 //    else if (cursors.right.isDown)
 //    {
 //    	sprite.body.moveRight(400);
 //    }

 //    if (cursors.up.isDown)
 //    {
 //    	sprite.body.moveUp(400);
 //    }
 //    else if (cursors.down.isDown)
 //    {
 //    	sprite.body.moveDown(400);
 //    }

}
