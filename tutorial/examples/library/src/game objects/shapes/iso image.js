var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            updateLand: updateLand
        }
    }
};

var color = new Phaser.Display.Color();
var heightmap;
var land = [];
var px = 0;
var py = 0;
var cursors;
var gridWidth = 54;
var gridHeight = 54;
var size = 24;
var tileWidthHalf = 15;
var tileHeightHalf = 10;
var centerX = 400;
var centerY = -200;
var spacing = 12;
var maxHeight = 120;
var imageWidth = 0;
var imageHeight = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/tests/terrain/terrain2.png');
}

function create ()
{
    var src = this.textures.get('pic').getSourceImage();

    imageWidth = src.width;
    imageHeight = src.height;

    heightmap = this.textures.createCanvas('map', imageWidth, imageHeight);

    heightmap.draw(0, 0, src);

    for (var y = 0; y < gridHeight; y++)
    {
        var row = [];

        for (var x = 0; x < gridWidth; x++)
        {
            var tx = (x - y) * tileWidthHalf;
            var ty = (x + y) * tileHeightHalf;

            var tile = this.add.isobox(centerX + tx, centerY + ty, size, size, 0x8dcb0e, 0x3f8403, 0x63a505);

            tile.setDepth(centerY + ty);

            row.push(tile);
        }

        land.push(row);
    }

    this.updateLand();

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    var down = false;

    if (cursors.left.isDown)
    {
        px--;
        py++;

        down = true;
    }
    else if (cursors.right.isDown)
    {
        px++;
        py--;

        down = true;
    }

    if (cursors.up.isDown)
    {
        px--;
        py--;

        down = true;
    }
    else if (cursors.down.isDown)
    {
        px++;
        py++;

        down = true;
    }

    if (px === imageWidth)
    {
        px = 0;
    }
    else if (px < 0)
    {
        px = imageWidth;
    }

    if (py === imageHeight)
    {
        py = 0;
    }
    else if (py < 0)
    {
        py = imageHeight;
    }

    if (down)
    {
        this.updateLand();
    }
}

function updateLand ()
{
    for (var y = 0; y < gridHeight; y++)
    {
        for (var x = 0; x < gridWidth; x++)
        {
            var cx = Phaser.Math.Wrap(px + x, 0, imageWidth);
            var cy = Phaser.Math.Wrap(py + y, 0, imageHeight);

            heightmap.getPixel(cx, cy, color);

            var h = color.v * maxHeight;
            var top = color.color;
            var left = color.darken(30).color;
            var right = color.lighten(15).color;

            land[y][x].setFillStyle(top, left, right);

            land[y][x].height = h;
        }
    }
}
