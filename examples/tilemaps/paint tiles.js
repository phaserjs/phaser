
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('desert', 'assets/tilemaps/maps/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');

}

var map;
var layer;

var marker;
var currentTile;
var cursors;

function create() {

    map = game.add.tilemap('desert');

    map.addTilesetImage('Desert', 'tiles');

    currentTile = map.getTile(2, 3);

    layer = map.createLayer('Ground');

    layer.resizeWorld();

    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown)
    {
        if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
        {
            currentTile = map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y));
        }
        else
        {
            if (map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)) != currentTile)
            {
                map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y))
            }
        }
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

}

function render() {

    game.debug.text('Left-click to paint. Shift + Left-click to select tile. Arrows to scroll.', 32, 32, '#efefef');

}
