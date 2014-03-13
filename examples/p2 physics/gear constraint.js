
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
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

    var sonic1 = game.add.sprite(200, 400, 'sonic');
	var sonic2 = game.add.sprite(600, 400, 'sonic');

	game.physics.p2.enable([sprite, sonic1, sonic2]);

    //  This constraint will make sure that as sprite rotates, sonic1 matches that rotation
    var constraint1 = game.physics.p2.createGearConstraint(sprite, sonic1, 0, 1);

    //  This constraint will make sure that as sprite rotates, sonic2 matches that rotation at half the ratio
    var constraint2 = game.physics.p2.createGearConstraint(sprite, sonic2, 0, 0.5);

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
