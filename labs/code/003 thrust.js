
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
	game.load.image('ship', 'assets/sprites/thrust_ship2.png');

}

var ship;
var cursors;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);

    var bg = game.add.sprite(0, 0, 'backdrop');
    bg.alpha = 0.4;

	ship = game.add.sprite(200, 200, 'ship');
	ship.physicsEnabled = true;

	game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();

    game.physics.defaultRestitution = 0.8;

}

function update() {

    if (cursors.left.isDown)
    {
		ship.body.rotateLeft(100);
    }
    else if (cursors.right.isDown)
    {
		ship.body.rotateRight(100);
    }
    else
    {
		ship.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
    	ship.body.thrust(400);
    }

}
