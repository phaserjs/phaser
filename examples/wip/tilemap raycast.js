
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('phaser', 'assets/sprites/phaser-dude.png');

}

var map;
var layer;
var cursors;
var sprite;
var line;
var tileHits = [];
var plotting = false;

function create() {

    line = new Phaser.Line();

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    
    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    map.setCollisionBetween(1, 12);

    layer.debug = true;

    sprite = game.add.sprite(260, 70, 'phaser');

    game.physics.enable(sprite);

    game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

    var help = game.add.text(10, 10, 'Arrows to move, click and drag to cast a ray', { font: '16px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;

    game.input.onDown.add(startLine, this);
    game.input.onUp.add(raycast, this);

}

function startLine(pointer) {

    if (tileHits.length > 0)
    {
        for (var i = 0; i < tileHits.length; i++)
        {
            tileHits[i].debug = false;
        }

        layer.dirty = true;
    }

    line.start.set(pointer.worldX, pointer.worldY);

    plotting = true;

}

function raycast(pointer) {

    line.end.set(pointer.worldX, pointer.worldY);

    tileHits = layer.getRayCastTiles(line, 4, false, false);

    if (tileHits.length > 0)
    {
        //  Just so we can visually see the tiles
        for (var i = 0; i < tileHits.length; i++)
        {
            tileHits[i].debug = true;
        }

        layer.dirty = true;
    }

    plotting = false;
    
}

function update() {

    if (plotting)
    {
        line.end.set(game.input.activePointer.worldX, game.input.activePointer.worldY);
    }

    game.physics.arcade.collide(sprite, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 200;
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
    }

}

function render() {

    game.debug.geom(line);

}
