
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level3', 'assets/maps/cybernoid.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/maps/cybernoid.png', 16, 16);
    game.load.image('phaser', 'assets/sprites/phaser-ship.png');
    game.load.image('diamond', 'assets/sprites/chunk.png');

}

var map;
var tileset;
var layer;
var cursors;
var overlap;
var sprite;
var emitter;

function create() {

    game.stage.backgroundColor = '#3d3d3d';

    //  A Tilemap object just holds the data needed to describe the map (i.e. the json exported from Tiled, or the CSV exported from elsewhere).
    //  You can add your own data or manipulate the data (swap tiles around, etc) but in order to display it you need to create a TilemapLayer.
    map = game.add.tilemap('level3');

    //  A Tileset is a single image containing a strip of tiles. Each tile is broken down into its own Phaser.Tile object on import.
    //  You can set properties on the Tile objects, such as collision, n-way movement and meta data.
    //  A Tilemap uses a Tileset to render. The indexes in the map corresponding to the Tileset indexes.
    //  This way multiple levels can share the same single Tileset without requiring one each.
    tileset = game.add.tileset('tiles');
    
    //  Basically this sets EVERY SINGLE tile to fully collide on all faces
    tileset.setCollisionRange(0, tileset.total - 1, true, true, true, true);

    //  And this turns off collision on the only tile we don't want collision on :)
    tileset.setCollision(6, false, false, false, false);
    tileset.setCollision(31, false, false, false, false);
    tileset.setCollision(34, false, false, false, false);
    tileset.setCollision(35, false, false, false, false);
    tileset.setCollision(46, false, false, false, false);

    //  A TilemapLayer consists of an x,y coordinate (position), a width and height, a Tileset and a Tilemap which it uses for map data.
    //  The x/y coordinates are in World space and you can place the tilemap layer anywhere in the world.
    //  The width/height is the rendered size of the layer in pixels, not the size of the map data itself.

    layer = game.add.tilemapLayer(0, 0, 800, 600, tileset, map, 0);

    layer.resizeWorld();

    sprite = game.add.sprite(450, 80, 'phaser');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.angle = 5;

    game.camera.follow(sprite);
    // game.camera.deadzone = new Phaser.Rectangle(160, 160, layer.renderWidth-320, layer.renderHeight-320);

    cursors = game.input.keyboard.createCursorKeys();

    emitter = game.add.emitter(0, 0, 200);

    emitter.makeParticles('diamond');
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.gravity = 5;
    emitter.bounce.setTo(0.5, 0.5);

    game.input.onDown.add(particleBurst, this);

}

function particleBurst() {

    emitter.x = game.input.worldX;
    emitter.y = game.input.worldY;
    emitter.start(true, 4000, null, 10);

}

function update() {

    game.physics.collide(sprite, layer);
    game.physics.collide(emitter, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 150;
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -150;
        sprite.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 150;
        sprite.scale.x = 1;
    }

}


function render() {

    game.debug.renderSpriteBounds(sprite);

    // game.debug.renderSpriteInfo(sprite, 32, 32);
    // game.debug.renderSpriteCoords(sprite, 32, 32);

}