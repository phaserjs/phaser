
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('atari', 'assets/sprites/atari800xl.png');
    game.load.image('lift', 'assets/sprites/flectrum.png');
	game.load.image('sky', 'assets/skies/cavern2.png');

}

var sprite;
var vu1;
var cursors;

function create() {

    game.add.image(0, 0, 'sky');

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

    //  Add 2 sprites which we'll join with a constraint
    sprite = game.add.sprite(200, 400, 'atari');

    vu1 = game.add.sprite(400, 400, 'lift');

	game.physics.p2.enable([sprite, vu1]);

    sprite.body.fixedRotation = true;
    vu1.body.fixedRotation = true;

    var constraint = game.physics.p2.createPrismaticConstraint(sprite, vu1, false, [150, 0], [-15, 0], [0, 1]);

    //  You can also set limits:
    /*
    constraint.upperLimitEnabled = true;
    constraint.upperLimit = game.physics.p2.pxm(0.5);
    constraint.lowerLimitEnabled = true;
    constraint.lowerLimit = game.physics.p2.pxm(-0.5);
    */

    text = game.add.text(20, 20, 'move with arrow keys', { fill: '#ffffff' });

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    sprite.body.setZeroVelocity();
    vu1.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
    	sprite.body.moveLeft(200);
    }
    else if (cursors.right.isDown)
    {
    	sprite.body.moveRight(200);
    }

    if (cursors.up.isDown)
    {
        vu1.body.moveUp(200);
    }
    else if (cursors.down.isDown)
    {
        vu1.body.moveDown(200);
    }


}
