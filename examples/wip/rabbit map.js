
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/features_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');

    game.load.image('phaser', 'assets/sprites/shinyball.png');
    // game.load.image('phaser', 'assets/sprites/atari130xe.png');
    // game.load.image('phaser', 'assets/sprites/mushroom2.png');

}

var cursors;
var map;
var coins;

var layer;
var layer2;
var layer3;

var sprite;

function create() {

    $('#step').click(function(){
        game.step();
    });

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');

    map.setCollisionBetween(1, 12);

    layer = map.createLayer('Tile Layer 1');

    // layer.debug = true;

    layer.resizeWorld();

    sprite = game.add.sprite(170, 450, 'phaser');
    sprite.debug = true;

    sprite.body.velocity.x = 200;


    // sprite.anchor.setTo(0.5, 0.5);

    //  We'll set a lower max angular velocity here to keep it from going totally nuts
    // sprite.body.maxAngular = 500;

    //  Apply a drag otherwise the sprite will just spin and never slow down
    // sprite.body.angularDrag = 50;

    // sprite.body.bounce.x = 0.8;
    // sprite.body.bounce.y = 0.8;

    // sprite.angle = 35;

    game.camera.follow(sprite);

    // game.input.onDown.add(getIt, this);

    cursors = game.input.keyboard.createCursorKeys();

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

    // sprite.body.velocity.x = 0;
    // sprite.body.velocity.y = 0;
    // sprite.body.angularVelocity = 0;

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

    // game.debug.renderSpriteBody(sprite);
    // game.debug.renderSpriteBounds(sprite);

    game.debug.renderPhysicsBody(sprite.body);
    game.debug.renderBodyInfo(sprite, 32, 32);

    // game.debug.renderText(sprite.deltaX, 32, 32);
    // game.debug.renderText(sprite.deltaY, 32, 48);
    // game.debug.renderText(sprite.body.deltaX(), 232, 32);
    // game.debug.renderText(sprite.body.deltaY(), 232, 48);

    // game.debug.renderText(sprite.body.left, 32, 32);
    // game.debug.renderText(sprite.body.top, 32, 48);

    // game.debug.renderSpriteCoords(sprite, 32, 320);

}