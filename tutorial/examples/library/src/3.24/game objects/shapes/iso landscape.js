var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
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
var gridWidth = 39;
var gridHeight = 46;
var size = 20;
var spacing = 12;
var offsetY = 90;
var maxHeight = 120;
var waterHeight = 60;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('noise', 'assets/tests/98_2.png');
    // this.load.image('noise', 'assets/tests/heightmap.png');
}

function create ()
{
    heightmap = this.textures.createCanvas('map', 512, 512);

    heightmap.draw(0, 0, this.textures.get('noise').getSourceImage());

    var ox = size;
    var r = 0;
    var h = size;

    for (var y = 0; y < gridHeight; y++)
    {
        var row = [];

        for (var x = 0; x < gridWidth - r; x++)
        {
            var tile = this.add.isobox(ox + x * size, offsetY + y * spacing, size, h, 0x8dcb0e, 0x3f8403, 0x63a505);

            row.push(tile);
        }

        r++;
        ox += size / 2;

        if (r === 2)
        {
            r = 0;
            ox = size;
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

        if (px < 0)
        {
            px = 512;
        }

        down = true;
    }
    else if (cursors.right.isDown)
    {
        px++;

        if (px === 512)
        {
            px = 0;
        }

        down = true;
    }

    if (cursors.up.isDown)
    {
        py--;

        if (py < 0)
        {
            py = 512;
        }

        down = true;
    }
    else if (cursors.down.isDown)
    {
        py++;

        if (py === 512)
        {
            py = 0;
        }

        down = true;
    }

    if (down)
    {
        this.updateLand();
    }
}

function updateLand ()
{
    var r = 0;

    for (var y = 0; y < gridHeight; y++)
    {
        for (var x = 0; x < gridWidth - r; x++)
        {
            var cx = Phaser.Math.Wrap(px + x, 0, 512);
            var cy = Phaser.Math.Wrap(py + y, 0, 512);

            heightmap.getPixel(cx, cy, color);

            var h = (Math.max(color.r, color.g, color.b) / 255) * maxHeight;

            if (h < waterHeight)
            {
                land[y][x].setFillStyle(0x00b9f2, 0x016fce, 0x028fdf);
            }
            else if (h === maxHeight)
            {
                land[y][x].setFillStyle(0xffe31f, 0xf2a022, 0xf8d80b);
            }
            else
            {
                land[y][x].setFillStyle(0x8dcb0e, 0x3f8403, 0x63a505);
            }

            land[y][x].height = h;
        }

        r++;

        if (r === 2)
        {
            r = 0;
        }
    }
}
