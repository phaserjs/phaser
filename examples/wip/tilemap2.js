
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    game.load.image('ufo', 'assets/sprites/ufo.png');
    game.load.image('ship', 'assets/sprites/thrust_ship2.png');

}

var ship;
var map;
var layer;
var cursors;
var dump;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    // map = game.add.tilemap('map');

    // map.addTilesetImage('ground_1x1');
    // map.addTilesetImage('tiles2');
    
    // map.setCollisionBetween(1, 12);

    // layer = map.createLayer('Tile Layer 1');

    // layer.resizeWorld();

    // dump = map.generateCollisionData(layer);

    ship = game.add.sprite(200, 200, 'ship');
    ship.physicsEnabled = true;
    //  We do this because our ship is shaped like a triangle, not a square :)
    ship.body.addPolygon({}, 29, 23  ,  0, 23  ,  14, 1);
    // ship.body.setCircle(32);
    // ship.body.setCircle(32, 20, 20);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
        ship.body.rotateLeft(100);
    }
    else if (cursors.right.isDown)
    {
        ship.body.rotateRight(100);
    }
    else
    {
        ship.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
        ship.body.thrust(400);
    }
    else if (cursors.down.isDown)
    {
        ship.body.reverse(400);
    }

}

function render() {

    // for (var i = 0, len = dump.length; i < len; i++)
    // {
        // game.debug.physicsBody(dump[i]);
    // }

    game.debug.physicsBody(ship.body);

}
