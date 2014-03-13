
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
	game.load.image('sky', 'assets/skies/sunset.png');

}

var sprite;
var cursors;

function create() {

    game.add.image(0, 0, 'sky');

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

    //  Add a sprite
	sprite = game.add.sprite(200, 200, 'atari');

    //  Enable if for physics. This creates a default rectangular body.
	game.physics.p2.enable(sprite);

    //  Create our spring
    var spring = game.physics.p2.createSpring(bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB);

    // var spring = game.physics.p2.

    //             var spring = new p2.Spring(bodyA,bodyB, {
    //                 stiffness: k,
    //                 restLength: l,
    //                 damping : d
    //             });



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
