var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1010,
    height: 600,
    backgroundColor: '#efefef',
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            drawStart: drawStart,
            drawStop: drawStop,
            drawUpdate: drawUpdate,
            changeColor: changeColor,
            updateColor: updateColor,
            deleteShape: deleteShape,
            changeShape: changeShape
        }
    }
};

var shapes = [];
var isDown = false;
var current = 1;
var shape = null;
var index = 0;
var cursors;
var color = new Phaser.Display.Color(255, 255, 255);
var map;
var fillTop;
var fillLeft;
var fillRight;
var swatchData;
var blockSize = 32;
var TILE_WIDTH = 16;
var TILE_HEIGHT = 32;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg1', 'assets/skies/gradient4.png');
    this.load.image('dp', 'assets/swatches/gradient-palettes.png');
}

function create ()
{
    this.add.image(0, 0, 'bg1').setOrigin(0);

    //  Create the swatch
    var src = this.textures.get('dp').getSourceImage();
    swatchData = this.textures.createCanvas('swatch', src.width, src.height);
    swatchData.draw(0, 0, src);

    var swatch = this.add.image(800, 0, 'dp').setOrigin(0).setDepth(1000);

    swatch.setInteractive();

    swatch.on('pointerdown', this.changeColor, this);
    swatch.on('pointermove', this.updateColor, this);

    fillTop = color.color;
    fillLeft = color.darken(30).color;
    fillRight = color.lighten(15).color;



    // this.input.keyboard.on('keydown_C', this.setCircle, this);
    // this.input.keyboard.on('keydown_R', this.setRectangle, this);
    // this.input.keyboard.on('keydown_E', this.setEllipse, this);
    // this.input.keyboard.on('keydown_S', this.setStar, this);
    // this.input.keyboard.on('keydown_L', this.setLine, this);
    // this.input.keyboard.on('keydown_DELETE', this.deleteShape, this);
    // this.input.keyboard.on('keydown_TAB', this.changeShape, this);

    cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointerdown', this.drawStart, this);
    this.input.on('pointermove', this.drawUpdate, this);
    this.input.on('pointerup', this.drawStop, this);
}

function mapToPx (mapX, mapY)
{
    var x = (mapX - mapY) * TILE_WIDTH;
    var y = (mapX + mapY) * TILE_HEIGHT / 2;

    return { x: x, y: y }
}

function pxToMap (screenX, screenY)
{
    screenX = Phaser.Math.Snap.Floor(screenX, TILE_WIDTH);
    screenY = Phaser.Math.Snap.Floor(screenY, TILE_HEIGHT);

    // var x = ((screenX / TILE_WIDTH) + (screenY / TILE_HEIGHT)) / 2;
    // var y = ((screenY / TILE_HEIGHT) - (screenX / TILE_WIDTH)) / 2;

    // var x = screenY / TILE_HEIGHT + screenX / (2 * TILE_WIDTH);
    // var y = screenY / TILE_HEIGHT - screenX / (2 * TILE_WIDTH);

    var x = ((screenY * 2 / TILE_HEIGHT) + (screenX / TILE_WIDTH))/2;
    var y = (screenY * 2 / TILE_HEIGHT) - x;

    return { x: x, y: y }
}

function changeColor (pointer, x, y, event)
{
    swatchData.getPixel(x, y, color);

    fillTop = color.color;
    fillLeft = color.darken(30).color;
    fillRight = color.lighten(15).color;

    if (shape)
    {
        shape.setFillStyle(fillTop, fillLeft, fillRight);
    }

    event.stopPropagation();
}

function updateColor (pointer, x, y, event)
{
    if (!pointer.isDown)
    {
        return;
    }

    swatchData.getPixel(x, y, color);

    fillTop = color.color;
    fillLeft = color.darken(30).color;
    fillRight = color.lighten(15).color;

    if (shape)
    {
        shape.setFillStyle(fillTop, fillLeft, fillRight);
    }

    event.stopPropagation();
}

function deleteShape ()
{
    if (shape)
    {
        shape.destroy();
        shape = null;
    }
}

function changeShape ()
{
    if (shapes.length < 2)
    {
        return;
    }

    index++;

    if (index >= shapes.length)
    {
        index = 0;
    }

    shape = shapes[index];
}

function update ()
{
    if (!shape)
    {
        return;
    }

    if (this.input.keyboard.checkDown(cursors.left, 100))
    {
        shape.x -= (cursors.left.shiftKey) ? TILE_WIDTH * 4 : TILE_WIDTH;
    }
    else if (this.input.keyboard.checkDown(cursors.right, 100))
    {
        shape.x += (cursors.right.shiftKey) ? TILE_WIDTH * 4 : TILE_WIDTH;
    }

    if (this.input.keyboard.checkDown(cursors.up, 100))
    {
        shape.y -= (cursors.up.shiftKey) ? TILE_HEIGHT * 4 : TILE_HEIGHT;
    }
    else if (this.input.keyboard.checkDown(cursors.down, 100))
    {
        shape.y += (cursors.down.shiftKey) ? TILE_HEIGHT * 4 : TILE_HEIGHT;
    }
}

function drawStart (pointer)
{
    if (current === 0)
    {
        return;
    }

    isDown = true;

    console.log('down', pointer.x, pointer.y);

    var pos = pxToMap(pointer.x, pointer.y);

    console.log('map', pos.x, pos.y);

    pos = mapToPx(pos.x, pos.y);

    console.log('px', pos.x, pos.y);

    shape = this.add.isobox(pos.x, pos.y, blockSize, blockSize * 0.70, fillTop, fillLeft, fillRight);
}

function drawUpdate (pointer)
{
    if (!isDown)
    {
        return;
    }

}

function drawStop ()
{
    isDown = false;

    shapes.push(shape);

    index++;
}
