
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {


    //  Tilemaps are split into two parts: The actual map data (usually stored in a CSV or JSON file) 
    //  and the tileset/s used to render the map.

    //  Here we'll load the tilemap data. The first parameter is a unique key for the map data.

    //  The second is a URL to the JSON file the map data is stored in. This is actually optional, you can pass the JSON object as the 3rd
    //  parameter if you already have it loaded (maybe via a 3rd party source or pre-generated). In which case pass 'null' as the URL and
    //  the JSON object as the 3rd parameter.

    //  The final one tells Phaser the foramt of the map data, in this case it's a JSON file exported from the Tiled map editor.
    //  This could be Phaser.Tilemap.CSV too.

    game.load.tilemap('mario', 'assets/maps/mario1.json', null, Phaser.Tilemap.TILED_JSON);

    //  Next we load the tileset. This consists of an image and a set of values that determine the size of the tiles within the image.
    //  In this case we give it a unique key, the URL to the PNG file and tell Phaser the tiles are all 16x16 pixels in size.

    game.load.tileset('tiles', 'assets/maps/mario1.png', 16, 16);

}

var map;
var tileset;
var layer;

function create() {

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');
    
    tileset = game.add.tileset('tiles');

    layer = game.add.tilemapLayer(0, 0, 800, 600, tileset, map, 0);

}
