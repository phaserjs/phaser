
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    // game.load.tilemap('map', 'assets/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.tileset('tiles', 'assets/maps/super_mario.png', 16, 16);

    game.load.tilemap('map', 'assets/tilemaps/maps/features_test.json', null, Phaser.Tilemap.TILED_JSON);

    // game.load.image('ground', 'assets/maps/ground_1x1.png');

    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');


    // game.load.tileset('tiles', 'assets/maps/ground_1x1.png', 32, 32);
    // game.load.image('phaser', 'assets/sprites/phaser-ship.png');
    // game.load.image('phaser', 'assets/sprites/mushroom2.png');
    game.load.image('phaser', 'assets/sprites/wabbit.png');
    // game.load.image('phaser', 'assets/sprites/arrow.png');
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
    // game.load.image('phaser', 'assets/sprites/darkwing_crazy.png');

}

var cursors;
var map;
var coins;

var layer;
var layer2;
var layer3;

var sprite;

function create() {

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');

    map.setCollisionBetween(1, 12);

    //  mario tiles
    // map.setCollisionByIndex(15);
    // map.setCollisionByIndex(40);
    // map.setCollisionByIndexRange(14, 16);
    // map.setCollisionByIndexRange(20, 25);
    // map.setCollisionByIndexRange(27, 29);

    // layer3 = map.createLayer('Tile Layer 3');
    // layer3.scrollFactorX = 0.5;

    // layer2 = map.createLayer('Tile Layer 2');
    // layer2.alpha = 0.5;

    layer = map.createLayer('Tile Layer 1');

    layer.debug = true;

    layer.resizeWorld();

    //coins = 
    map.createFromObjects('Object Layer 1', 34, 'coin', 0);

    // layer2 = game.add.tilemapLayer(0, 0, 400, 600, null, map, 0);
    // layer.cameraOffset.x = 400;
    // layer.alpha = 0.5;


    sprite = game.add.sprite(260, 100, 'phaser');
    // sprite.anchor.setTo(0.5, 0.5);

    //  This adjusts the collision body size.
    //  100x50 is the new width/height.
    //  50, 25 is the X and Y offset of the newly sized box.
    //  In this case the box is 50px in and 25px down.
    // sprite.body.setSize(16, 16, 8, 8);

    //  We'll set a lower max angular velocity here to keep it from going totally nuts
    sprite.body.maxAngular = 500;

    //  Apply a drag otherwise the sprite will just spin and never slow down
    sprite.body.angularDrag = 50;

    // sprite.body.drag.x = 50;
    // sprite.body.drag.y = 20;

    // sprite.body.velocity.x = 50;

    sprite.body.bounce.x = 0.8;
    sprite.body.bounce.y = 0.8;

    // sprite.angle = 35;

    // game.camera.follow(sprite);

    // game.input.onDown.add(getIt, this);

    cursors = game.input.keyboard.createCursorKeys();

}

function getIt() {

    // console.log('cam', game.camera.bounds);
    // console.log('w', game.world.bounds);
    // console.log(layer.getTiles(sprite.body.x, sprite.body.y, sprite.body.width, sprite.body.height, true, true));

}

function update() {

/*
    if (cursors.left.isDown)
    {
        game.camera.x -= 1;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 1;
    }

    if (cursors.up.isDown)
    {
        layer.scrollY -= 4;
    }
    else if (cursors.down.isDown)
    {
        layer.scrollY += 4;
    }
*/
    game.physics.collide(sprite, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;

    // sprite.body.acceleration.x = 0;
    // sprite.body.angularAcceleration = 0;

    /*
    if (cursors.left.isDown)
    {
        // sprite.body.acceleration.x = -200;
        sprite.body.angularVelocity = -300;
        // sprite.body.angularAcceleration -= 200;
    }
    else if (cursors.right.isDown)
    {
        // sprite.body.acceleration.x = 200;
        sprite.body.angularVelocity = 300;
        // sprite.body.angularAcceleration += 200;
    }

    if (cursors.up.isDown)
    {
        game.physics.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
    }
    else
    {
        // game.physics.velocityFromAngle(sprite.angle, sprite.body.velocity, sprite.body.velocity);
    }
    */




    /*
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    sprite.angle = sprite.angle + 1;
    */

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -100;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 100;
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -100;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 100;
    }


}

function render() {

    // game.debug.spriteBody(sprite);
    // game.debug.spriteBounds(sprite);
    game.debug.physicsBody(sprite.body);

    // game.debug.text(sprite.deltaX, 32, 32);
    // game.debug.text(sprite.deltaY, 32, 48);
    // game.debug.text(sprite.body.deltaX(), 232, 32);
    // game.debug.text(sprite.body.deltaY(), 232, 48);

    // game.debug.text(sprite.body.left, 32, 32);
    // game.debug.text(sprite.body.right, 32, 48);

    game.debug.spriteCoords(sprite, 32, 32);

}