
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/maps/commando.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/maps/commando.png');
    game.load.image('phaser', 'assets/sprites/arrow.png');

}

var cursors;
var map;
var layer;
var sprite;

function create() {

    map = game.add.tilemap('map');

    map.addTilesetImage('CommandoMap1-1BG_bank.png', 'tiles');

    layer = map.createLayer('ShoeBox Tile Grab');
    // layer.debug = true;
    layer.resizeWorld();

    sprite = game.add.sprite(260, 100, 'phaser');
    sprite.anchor.setTo(0.5, 0.5);

    sprite.body.setSize(16, 16, 8, 8);

    //  We'll set a lower max angular velocity here to keep it from going totally nuts
    sprite.body.maxAngular = 500;

    //  Apply a drag otherwise the sprite will just spin and never slow down
    sprite.body.angularDrag = 50;

    game.camera.follow(sprite);

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

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;

    // sprite.body.acceleration.x = 0;
    // sprite.body.angularAcceleration = 0;

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

    /*
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    sprite.angle = sprite.angle + 1;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -900;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 900;
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -900;
        // sprite.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 900;
        // sprite.scale.x = 1;
    }
    */


}

function render() {

    // game.debug.spriteBody(sprite);
    // game.debug.spriteBounds(sprite);

    // game.debug.text(sprite.x, 32, 32);
    // game.debug.text(sprite.y, 32, 48);

    // game.debug.text(layer.scrollX, 32, 32);
    // game.debug.text(layer.scrollY, 32, 48);

}