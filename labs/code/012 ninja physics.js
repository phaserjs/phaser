
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('ninja-tiles', 'assets/physics/ninja-tiles32.png', 32, 32, 34);
    game.load.json('level', 'assets/physics/ninja-test-level.json');
    game.load.image('ball', 'assets/sprites/shinyball.png');
    game.load.image('sky', 'assets/skies/sky2.png');

}

var sprite1;
var tiles;
var cursors;

function create() {

	var sky = game.add.image(0, 0, 'sky');
	sky.fixedToCamera = true;

	//	Activate the Ninja physics system
	game.physics.startSystem(Phaser.Physics.NINJA);

    sprite1 = game.add.sprite(100, 0, 'ball');

    //  Enable the physics body for the Ninja physics system
    game.physics.ninja.enableCircle(sprite1, sprite1.width / 2);

    //	A little more bounce
    sprite1.body.bounce = 0.5;

    //  We'll just create the tiles from the JSON data
    var layer = game.cache.getJSON('level').layers[0];
    var i = 0;
    var data = layer.data;
    var width = layer.width;
    var height = layer.height;

    //	Resize the world to match
    game.world.setBounds(0, 0, width * 32, height * 32);

    tiles = game.add.group();

    var tile;

    for (var y = 0; y < height; y++)
    {
	    for (var x = 0; x < width; x++)
	    {
	    	if (data[i] > 0)
	    	{
		    	tile = tiles.create(x * 32, y * 32, 'ninja-tiles', data[i] - 1);
		    	game.physics.ninja.enableTile(tile, tile.frame);
	    	}

	    	i++;
	    }
    }

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(sprite1);

}

function update() {

	game.physics.ninja.collide(sprite1, tiles);

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
}
