
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.tilemap('nes', 'assets/maps/mario1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tilesNes', 'assets/maps/mario1.png',16,16);

    game.load.tilemap('snes', 'assets/maps/smb_level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tilesSnes', 'assets/maps/smb_tiles.png',16,16);
}

function create() {

    game.stage.backgroundColor = '#5c94fc';

    mapNes = game.add.tilemap('nes');

    tilesetNes = game.add.tileset('tilesNes');


    layerNes = game.add.tilemapLayer(0, 0, mapNes.layers[0].width*tilesetNes.tileWidth, 600, tilesetNes, mapNes, 0);

    layerNes.fixedToCamera=false;
 
    layerNes.resizeWorld();


    mapSnes = game.add.tilemap('snes');

    tilesetSnes = game.add.tileset('tilesSnes');


    layerSnes = game.add.tilemapLayer(0, 168, mapSnes.layers[0].width*tilesetSnes.tileWidth, 600, tilesetSnes, mapSnes, 0);

    layerSnes.fixedToCamera=false;

    game.add.tween(game.camera).to( { x: 5120-800 }, 30000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    game.input.onDown.add(goFull, this);

}

function goFull() {
    game.stage.scale.startFullScreen();
}
