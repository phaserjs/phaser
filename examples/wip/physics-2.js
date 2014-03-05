
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/tile_collision_test.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('phaser', 'assets/sprites/arrow.png');
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);

}

var map;
var layer;

var sprite;
var cursors;

function create() {

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    // map.addTilesetImage('coin');

    map.setCollisionBetween(1, 12);

    // map.setTileIndexCallback(26, hitCoin, this);

    // map.setTileLocationCallback(2, 0, 1, 1, hitCoin, this);

    layer = map.createLayer('Tile Layer 1');

    layer.debug = true;

    layer.resizeWorld();

    // game.physics.arcade.gravity.y = 100;

    sprite = game.add.sprite(260, 100, 'phaser');
    sprite.anchor.setTo(0.5, 0.5);

    game.physics.enable(sprite);

    // sprite.body.setRectangle(16, 16, 8, 8);

    //  We'll set a lower max angular velocity here to keep it from going totally nuts
    sprite.body.maxAngular = 500;

    //  Apply a drag otherwise the sprite will just spin and never slow down
    sprite.body.angularDrag = 50;

    // sprite.body.bounce.x = 0.8;
    // sprite.body.bounce.y = 0.8;

    debugSprite = sprite;

    game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

}

function hitCoin(sprite, tile) {

    tile.tile.alpha = 0.2;

    layer.dirty = true;

    return false;

}

function update() {

    game.physics.arcade.collide(sprite, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;

    if (cursors.left.isDown)
    {
        sprite.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularVelocity = 300;
    }

    if (cursors.up.isDown)
    {
        game.physics.arcade.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
    }

}

function render() {

    // game.debug.bodyInfo(sprite, 16, 24);
    // game.debug.physicsBody(sprite.body);

    var r = new Phaser.Rectangle(sprite.body.x, sprite.body.y, sprite.body.width, sprite.body.height);
    game.debug.geom(r);

}