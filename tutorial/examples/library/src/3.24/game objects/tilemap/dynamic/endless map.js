var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var map;
var text;
var sx = 0;
var mapWidth = 51;
var mapHeight = 37;
var distance = 0;
var tiles = [ 7, 7, 7, 6, 6, 6, 0, 0, 0, 1, 1, 2, 3, 4, 5 ];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/muddy-ground.png');
    this.load.bitmapFont('nokia16', 'assets/fonts/bitmap/nokia16.png', 'assets/fonts/bitmap/nokia16.xml');
}

function create ()
{
    var mapData = [];

    for (var y = 0; y < mapHeight; y++)
    {
        var row = [];

        for (var x = 0; x < mapWidth; x++)
        {
            //  Scatter the tiles so we get more mud and less stones
            var tileIndex = Phaser.Math.RND.weightedPick(tiles);

            row.push(tileIndex);
        }

        mapData.push(row);
    }

    map = this.make.tilemap({ data: mapData, tileWidth: 16, tileHeight: 16 });

    var tileset = map.addTilesetImage('tiles');
    var layer = map.createDynamicLayer(0, tileset, 0, 0);

    text = this.add.bitmapText(0, 0, 'nokia16').setScrollFactor(0);
}

function update (time, delta)
{
    //  Any speed as long as 16 evenly divides by it
    sx += 4;

    distance += sx;

    text.setText("Distance: " + distance + 'px');

    if (sx === 16)
    {
        //  Reset and create new strip

        var tile;
        var prev;

        for (var y = 0; y < mapHeight; y++)
        {
            for (var x = 1; x < mapWidth; x++)
            {
                tile = map.getTileAt(x, y);
                prev = map.getTileAt(x - 1, y);

                prev.index = tile.index;

                if (x === mapWidth - 1)
                {
                    tile.index = Phaser.Math.RND.weightedPick(tiles);
                }
            }
        }

        sx = 0;
    }

    this.cameras.main.scrollX = sx;
}
