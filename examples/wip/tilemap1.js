
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    game.load.image('player', 'assets/sprites/phaser-dude.png');

}

var map;
var tileset;
var layer;
var p;
var b;
var cursors;

function create() {

    // game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');
    
    // layer = map.createLayer('Tile Layer 1');

    // layer.resizeWorld();

    p = game.add.sprite(32, 32, 'player');

    b = game.add.sprite(600, 400, 'player');
    b.physicsEnabled = true;
    // b.body.clearShapes();
    b.body.addLine(32, 0, 0, 0.2);

    var ox = 192;
    var oy = 352;
    var data = [0,0 ,  0, -32 , 32, -64 , 64, -64 , 64,-96, 128,-96, 160,-128, 192,-128, 192,-96, 160,-64, 96,-64, 96,-32, 32,-32, 32,0, 0,0];
    var output = [];

    for (var i = 0; i < data.length; i += 2)
    {
        output.push(ox + data[i]);
        output.push(oy + data[i+1]);
    }

    console.log(output);

    // var re = b.body.addPolygon({}, output);

    console.log(data.length);
    // console.log(re);
    console.log(output);
    console.log(b.body.data.shapes[0].vertices);


    game.camera.follow(p);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
        p.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        p.x += 4;
    }

}

function render() {

    // game.debug.renderCameraInfo(game.camera, 420, 320);
    game.debug.renderPhysicsBody(b.body);

}
