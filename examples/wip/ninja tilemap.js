
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/ninja-tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ball', 'assets/sprites/shinyball.png');
    game.load.image('sky', 'assets/skies/sky2.png');
    game.load.image('kenney', 'assets/tilemaps/tiles/kenney.png');

}

var sprite1;
var cursors;
var map;
var layer;
var tiles;

function create() {

	var sky = game.add.image(0, 0, 'sky');
	sky.fixedToCamera = true;

	//	Activate the Ninja physics system
	game.physics.startSystem(Phaser.Physics.NINJA);

    map = game.add.tilemap('map');

    map.addTilesetImage('kenney');
    
    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    var slopeMap = { '32': 1, '77': 1, '95': 2, '36': 3, '137': 3, '140': 2 };

    tiles = game.physics.ninja.convertTilemap(map, layer, slopeMap);

    sprite1 = game.add.sprite(50, 50, 'ball');
    // game.physics.ninja.enableAABB(sprite1);
    game.physics.ninja.enableCircle(sprite1, sprite1.width / 2);

    //  A little more bounce
    sprite1.body.bounce = 0.5;

    game.camera.follow(sprite1);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    for (var i = 0; i < tiles.length; i++)
    {
        sprite1.body.circle.collideCircleVsTile(tiles[i].tile);
        // sprite1.body.aabb.collideAABBVsTile(tiles[i].tile);
    }

	// game.physics.ninja.collide(sprite1, tiles);

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


	// game.debug.text(sprite1.body.shape.velocity.x, 32, 32);
	// game.debug.text(sprite1.body.shape.velocity.y, 32, 64);
	// game.debug.text(game.math.radToDeg(sprite1.body.angle), 32, 96);

	// tile1.render(game.context, 'ninja-tiles');
	// tile2.render(game.context, 'ninja-tiles');

    // game.debug.geom(sprite1.body, 'rgba(0,255,0,0.4)', true, 1);

    // game.debug.geom(tile1, 'rgba(0,255,0,0.4)', true, 1);
    // game.debug.geom(tile1, 'rgba(0,255,0,0.4)', true, 1);

}
