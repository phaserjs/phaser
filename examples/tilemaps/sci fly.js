
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

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

    layer.debug = true;

    layer.resizeWorld();

    sprite = game.add.sprite(450, 80, 'phaser');
    sprite.anchor.setTo(0.5, 0.5);

    game.camera.follow(sprite);
    // game.camera.deadzone = new Phaser.Rectangle(160, 160, layer.renderWidth-320, layer.renderHeight-320);

    cursors = game.input.keyboard.createCursorKeys();

    emitter = game.add.emitter(0, 0, 200);

    emitter.makeParticles('chunk');
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.gravity = 150;
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
