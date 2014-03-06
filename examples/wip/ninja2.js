
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('ninja-tiles', 'assets/physics/ninja-tiles.png', 128, 128, 34);
    game.load.image('a', 'assets/sprites/firstaid.png');
    game.load.image('ball', 'assets/sprites/shinyball.png');

}

var sprite1;
var cursors;

var tile1;
var tile2;

var t;
var running = false;

function create() {

	game.stage.smoothed = true;

	//	Activate the Ninja physics system
	game.physics.startSystem(Phaser.Physics.NINJA);

	// game.physics.ninja.gravity = 0.1;

    sprite1 = game.add.sprite(102, 200, 'ball');

    //  Enable the physics body for the Ninja physics system
    //	By default it will create an AABB body for the sprite
    game.physics.ninja.enableCircle(sprite1, sprite1.width / 2);

    //	But you can change it to either a Tile or a Circle
    tile1 = game.add.sprite(100, 500, 'ninja-tiles', 14);
    tile1.width = 100;
    tile1.height = 100;

    game.physics.ninja.enableTile(tile1, 14);

    cursors = game.input.keyboard.createCursorKeys();

}

function collisionHandler() {
	game.stage.backgroundColor = 0xff0000;
}

function update() {

	game.physics.ninja.collide(sprite1, tile1, collisionHandler, null, this);

	// tile1.body.moveRight(1);

	/*
	if (cursors.up.isDown && !running)
	{
		running = true;
		t = Date.now();
	}

    sprite1.body.setZeroVelocity();

	if (running)
	{
		sprite1.body.moveRight(100);

		if (sprite1.body.x >= 200)
		{
			var ms = Date.now() - t;
			console.log('100px in ', ms);
			running = false;
		    sprite1.body.setZeroVelocity();
		}
	}
	*/

    // sprite1.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
        sprite1.body.moveLeft(20);
    }
    else if (cursors.right.isDown)
    {
        sprite1.body.moveRight(20);
    }

    if (cursors.up.isDown)
    {
        sprite1.body.moveUp(20);
    }
    else if (cursors.down.isDown)
    {
        sprite1.body.moveUp(20);
    }

}

function render() {

	game.debug.text(sprite1.body.shape.velocity.x, 32, 32);
	game.debug.text(sprite1.body.shape.velocity.y, 32, 64);
	game.debug.text(game.math.radToDeg(sprite1.body.angle), 32, 96);

	// tile1.render(game.context, 'ninja-tiles');
	// tile2.render(game.context, 'ninja-tiles');

    // game.debug.geom(sprite1.body, 'rgba(0,255,0,0.4)', true, 1);

    // game.debug.geom(tile1, 'rgba(0,255,0,0.4)', true, 1);
    // game.debug.geom(tile1, 'rgba(0,255,0,0.4)', true, 1);

}
