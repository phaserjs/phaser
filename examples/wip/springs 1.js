
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
	game.load.image('box', 'assets/sprites/block.png');

}

var box1;
var box2;
var s;

var cursors;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);
    game.add.sprite(0, 0, 'backdrop');

//    game.physics.gravity.y = -9.78;
    game.physics.gravity[1] = -9.78;

    // game.physics.onBodyAdded.add(addedToWorld, this);

	box1 = game.add.sprite(200, 200, 'box');
	box1.physicsEnabled = true;
	// box1.body.fixedRotation = true;
	// box1.body.mass = 3;

	box2 = game.add.sprite(400, 200, 'box');
	box2.physicsEnabled = true;
	// box2.body.fixedRotation = true;

	s = new Phaser.Physics.Spring(game, box1.body.data, box2.body.data, 2, 10, 1, null, null, [ 0, 70 ], [ 0, 70 ]);

	game.physics.addSpring(s);

        // var s = new p2.Spring(box1, box2, {
        //     restLength : 1,
        //     stiffness : 10,
        //     localAnchorA : [0,0.5],
        //     localAnchorB : [0,0.5],
        // });
        // world.addSpring(s);

	game.camera.follow(box2);

    cursors = game.input.keyboard.createCursorKeys();

    // game.physics.defaultRestitution = 0.8;

}

function addedToWorld(body, world) {

	console.log('Body added for', body);

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

	// game.debug.text('x: ' + box2.body.velocity.x, 32, 32);
	// game.debug.text('y: ' + box2.body.velocity.y, 32, 64);

}

