
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
	game.load.image('ship', 'assets/sprites/thrust_ship2.png');

}

var ship;
var cursors;

function p2px(v) {
	return v *= -20;
}

function px2p(v) {
	return v * -0.05;
}

function create() {

    game.world.setBounds(0, 0, 1920, 1200);

    var bg = game.add.sprite(0, 0, 'backdrop');
    bg.alpha = 0.2;

	ship = game.add.sprite(200, 200, 'ship');
	ship.anchor.set(0.5);
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

function render() {

	game.debug.text('x: ' + ship.body.x, 32, 32);
	game.debug.text('y: ' + ship.body.y, 32, 64);

}

