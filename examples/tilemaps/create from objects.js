
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/features_test.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');

    game.load.image('phaser', 'assets/sprites/arrow.png');
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);

}

var cursors;
var map;
var coins;

var layer;
var sprite;

function create() {

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');

    map.setCollisionBetween(1, 12);

    layer = map.createLayer('Tile Layer 1');

    // layer.debug = true;

    layer.resizeWorld();

    //  Here we create our coins group
    coins = game.add.group();

    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, coins);

    //  Add animations to all of the coin sprites
    coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
    coins.callAll('animations.play', 'animations', 'spin');

    sprite = game.add.sprite(260, 100, 'phaser');
    sprite.anchor.setTo(0.5, 0.5);

    //  This adjusts the collision body size.
    sprite.body.setRectangle(16, 16, 25, 15);

    //  We'll set a lower max angular velocity here to keep it from going totally nuts
    sprite.body.maxAngular = 500;

    //  Apply a drag otherwise the sprite will just spin and never slow down
    sprite.body.angularDrag = 50;

    game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.collide(sprite, layer);
    game.physics.overlap(sprite, coins, collectCoin, null, this);

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
        game.physics.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
    }


}

function collectCoin(player, coin) {

    coin.kill();

}

function render() {

    game.debug.physicsBody(sprite.body);

}