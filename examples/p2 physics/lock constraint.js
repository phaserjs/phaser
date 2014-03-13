
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
    sprite = game.add.sprite(400, 200, 'ball');

    var vu1 = game.add.sprite(400, 300, 'vu');

	game.physics.p2.enable([sprite, vu1]);

    //  Lock the two bodies together. The [0, 50] sets the distance apart (y: 80)
    var constraint = game.physics.p2.createLockConstraint(sprite, vu1, [0, 80], 0);

    text = game.add.text(20, 20, 'move with arrow keys', { fill: '#ffffff' });

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
    	sprite.body.moveLeft(100);
    }
    else if (cursors.right.isDown)
    {
    	sprite.body.moveRight(100);
    }

    if (cursors.up.isDown)
    {
        sprite.body.moveUp(100);
    }
    else if (cursors.down.isDown)
    {
        sprite.body.moveDown(100);
    }


}
