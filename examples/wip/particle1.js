
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ship', 'assets/sprites/thrust_ship2.png');
    game.load.image('chunk', 'assets/sprites/chunk.png');

}

var ship;
var sprite2;
var body;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    game.physics.gravity[1] = -1;

    ship = game.add.sprite(200, 200, 'ship');
    ship.physicsEnabled = true;
    //  We do this because our ship is shaped like a triangle, not a square :)
    ship.body.addPolygon({}, 29, 23  ,  0, 23  ,  14, 1);

    sprite2 = game.add.sprite(300, 300, 'chunk');

    cursors = game.input.keyboard.createCursorKeys();

    game.input.onDown.add(spawn, this);

}

function spawn() {

    body = new Phaser.Physics.Body(game, null, 300, 100, 1);

	body.addParticle(4, 4, 0, 0, 0);

	game.physics.addBody(body.data);

}

function update() {

	if (body)
	{
		sprite2.x = body.x;
		sprite2.y = body.y;
	}

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
    else if (cursors.down.isDown)
    {
        ship.body.reverse(400);
    }

}

function render() {

}
