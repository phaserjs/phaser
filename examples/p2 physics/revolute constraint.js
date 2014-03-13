
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('vu', 'assets/sprites/vu.png');
    game.load.image('ball', 'assets/sprites/arrow.png');
	game.load.image('sky', 'assets/skies/cavern2.png');

}

var sprite;
var cursors;

function create() {

    game.add.image(0, 0, 'sky');

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

    //  Add 2 sprites which we'll join with a constraint
    sprite = game.add.sprite(400, 300, 'ball');

    var vu1 = game.add.sprite(400, 300, 'vu');

	game.physics.p2.enable([sprite, vu1]);

    //  So they don't collide with each other
    sprite.body.clearCollision(true, true);
    vu1.body.clearCollision(true, true);

    var constraint = game.physics.p2.createRevoluteConstraint(sprite, [ 50, 100 ], vu1, [ 0, 0 ]);

    text = game.add.text(20, 20, 'rotate with arrow keys', { fill: '#ffffff' });

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
    	sprite.body.rotateLeft(50);
    }
    else if (cursors.right.isDown)
    {
    	sprite.body.rotateRight(50);
    }

}
