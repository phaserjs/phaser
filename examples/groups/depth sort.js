var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.tilemap('desert', 'assets/tilemaps/maps/depthsort.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.spritesheet('trees', 'assets/tilemaps/tiles/walls_1x2.png', 32, 64);

}

var map;
var tileset;
var layer;

var sprite;
var group;
var oldY = 0;
var cursors;
var locs = [];

function create() {

    //  Create our tilemap to walk around
    map = game.add.tilemap('desert');
    map.addTilesetImage('ground_1x1');
    layer = map.createLayer('Tile Layer 1');

    //  This group will hold the main player + all the tree sprites to depth sort against
    group = game.add.group();

    //  Create some trees, each in a unique location (otherwise we'll get sort flicker)
    for (var i = 0; i < 100; i++)
    {
        createUniqueLocation();
    }

    //  The player
    sprite = group.create(300, 200, 'phaser');

    group.sort();

    dump();

    // group.children[0].alpha = 0.2;
    // group.children[100].alpha = 0.2;

    //  Move it
    cursors = game.input.keyboard.createCursorKeys();

}

function dump() {

    for (var i = 0; i < group.children.length; i++)
    {
        console.log('Tree',i,'at',group.children[i].y);
    }

}

function createUniqueLocation() {

    var x = game.math.snapTo(game.world.randomX, 32) / 32;
    var y = game.math.snapTo(game.world.randomY, 32) / 32;
    y--;

    var idx = (y * 19) + x;

    while (locs.indexOf(idx) !== -1)
    {
        x = game.math.snapTo(game.world.randomX, 32) / 32;
        y = game.math.snapTo(game.world.randomY, 32) / 32;
        y--;
        idx = (y * 19) + x;
    }
    
    locs.push(idx);

    group.create(x * 32, y * 32, 'trees', game.rnd.integerInRange(0, 7));

}

function update() {

    if (cursors.left.isDown)
    {
        sprite.x -= 2;
    }
    else if (cursors.right.isDown)
    {
        sprite.x += 2;
    }

    if (cursors.up.isDown)
    {
        sprite.y -= 2;
    }
    else if (cursors.down.isDown)
    {
        sprite.y += 2;
    }

    // if (sprite.y !== oldY)
    // {
        group.sort();
        // oldY = sprite.y;
    // }

}

function render() {

    game.debug.text(sprite.y, 32, 32);

}