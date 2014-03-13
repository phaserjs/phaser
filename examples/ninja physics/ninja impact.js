
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

function preload() {

    game.load.spritesheet('ninja-tiles', 'assets/physics/ninja-tiles128.png', 128, 128, 34);
    game.load.image('a', 'assets/sprites/firstaid.png');

}

var sprite1;
var cursors;

var tile1;
var tile2;



function create() {

	game.stage.smoothed = true;

	//	Activate the Ninja physics system
	game.physics.startSystem(Phaser.Physics.NINJA);

	// game.physics.ninja.gravity = 0.1;

    sprite1 = game.add.sprite(500, 200, 'a');

    //  Enable the physics body for the Ninja physics system
    //	By default it will create an AABB body for the sprite
    game.physics.ninja.enableAABB(sprite1);

    //	But you can change it to either a Tile or a Circle
    tile1 = game.add.sprite(0, 500, 'ninja-tiles', 14);
    tile1.width = 100;
    tile1.height = 100;

    game.physics.ninja.enableTile(tile1, tile1.frame);

    cursors = game.input.keyboard.createCursorKeys();

}

function collisionHandler() {
	game.stage.backgroundColor = 0xff0000;
}

function update() {

	game.physics.ninja.collide(sprite1, tile1, collisionHandler, null, this);

	tile1.body.moveRight(1);

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
