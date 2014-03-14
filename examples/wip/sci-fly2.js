
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level3', 'assets/tilemaps/maps/cybernoid.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/cybernoid.png', 16, 16);
    game.load.image('phaser', 'assets/sprites/phaser-ship.png');
    game.load.image('chunk', 'assets/sprites/chunk.png');

}

var map;
var layer;
var cursors;
var sprite;
var emitter;

function create() {

    //  A Tilemap object just holds the data needed to describe the map (i.e. the json exported from Tiled, or the CSV exported from elsewhere).
    //  You can add your own data or manipulate the data (swap tiles around, etc) but in order to display it you need to create a TilemapLayer.
    map = game.add.tilemap('level3');

    map.addTilesetImage('CybernoidMap3BG_bank.png', 'tiles');

    layer = map.createLayer(0);

    //  Basically this sets EVERY SINGLE tile to fully collide on all faces
    map.setCollisionByExclusion([7, 32, 35, 36, 47]);

    // layer.debug = true;

    layer.resizeWorld();

    cursors = game.input.keyboard.createCursorKeys();

    emitter = game.add.emitter(0, 0, 200);

    emitter.makeParticles('chunk');
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.gravity = 150;
    emitter.bounce.setTo(0.5, 0.5);

    sprite = game.add.sprite(200, 70, 'phaser');
    sprite.anchor.set(0.5);

    game.physics.enable(sprite);

    //  Because both our body and our tiles are so tiny,
    //  and the body is moving pretty fast, we need to add
    //  some tile padding to the body. WHat this does
    sprite.body.tilePadding.set(64, 64);

    game.camera.follow(sprite);

}

function particleBurst() {

    emitter.x = sprite.x;
    emitter.y = sprite.y;
    emitter.start(true, 2000, null, 1);

}

function update() {

    game.physics.arcade.collide(sprite, layer);
    game.physics.arcade.collide(emitter, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
        particleBurst();
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 200;
        particleBurst();
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
        sprite.scale.x = -1;
        particleBurst();
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
        sprite.scale.x = 1;
        particleBurst();
    }

}

function render() {

    game.debug.body(sprite);

}
