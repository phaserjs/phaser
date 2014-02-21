
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', 'assets/tilemaps/tiles/test.png');

}

var map;
var layer;

function create() {

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('map');

    map.addTilesetImage('tileset');
    
    layer = map.createLayer('calque1');

    console.log(layer);

    // layer.resizeWorld();

    // map.setCollisionBetween(1, 12);

    // layer.debug = true;

    // dump = map.generateCollisionData(layer);

}

function update() {
}

function render() {
}
