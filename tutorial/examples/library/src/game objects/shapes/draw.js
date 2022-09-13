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
            setCircle: setCircle,
            setRectangle: setRectangle,
            setEllipse: setEllipse,
            setStar: setStar,
            setLine: setLine,
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
var color = new Phaser.Display.Color();
var swatchData;

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

    this.input.keyboard.on('keydown_C', this.setCircle, this);
    this.input.keyboard.on('keydown_R', this.setRectangle, this);
    this.input.keyboard.on('keydown_E', this.setEllipse, this);
    this.input.keyboard.on('keydown_S', this.setStar, this);
    this.input.keyboard.on('keydown_L', this.setLine, this);
    this.input.keyboard.on('keydown_DELETE', this.deleteShape, this);
    this.input.keyboard.on('keydown_TAB', this.changeShape, this);

    cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointerdown', this.drawStart, this);
    this.input.on('pointermove', this.drawUpdate, this);
    this.input.on('pointerup', this.drawStop, this);
}

function changeColor (pointer, x, y, event)
{
    swatchData.getPixel(x, y, color);

    if (shape)
    {
        shape.setFillStyle(color.color);
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

    if (shape)
    {
        shape.setFillStyle(color.color);
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
        shape.x -= (cursors.left.shiftKey) ? 10 : 1;
    }
    else if (this.input.keyboard.checkDown(cursors.right, 100))
    {
        shape.x += (cursors.right.shiftKey) ? 10 : 1;
    }

    if (this.input.keyboard.checkDown(cursors.up, 100))
    {
        shape.y -= (cursors.up.shiftKey) ? 10 : 1;
    }
    else if (this.input.keyboard.checkDown(cursors.down, 100))
    {
        shape.y += (cursors.down.shiftKey) ? 10 : 1;
    }
}

function drawStart (pointer)
{
    if (current === 0)
    {
        return;
    }

    isDown = true;

    switch (current)
    {
        case 1:
            shape = this.add.circle(pointer.x, pointer.y, 4, color.color);
            break;

        case 2:
            shape = this.add.rectangle(pointer.x, pointer.y, 4, 4, color.color);
            break;

        case 3:
            shape = this.add.ellipse(pointer.x, pointer.y, 4, 4, color.color);
            break;

        case 4:
            shape = this.add.star(pointer.x, pointer.y, 5, 2, 4, color.color);
            break;

        case 5:
            shape = this.add.line(pointer.x, pointer.y, 0, 0, 4, 0, color.color);
            break;
    }
}

function drawUpdate (pointer)
{
    if (!isDown)
    {
        return;
    }

    switch (current)
    {
        case 1:
            shape.radius = pointer.getDistance();
            break;

        case 2:
            shape.setSize(pointer.x - pointer.downX, pointer.y - pointer.downY);
            break;

        case 3:
            shape.setSize((pointer.x - pointer.downX) * 2, (pointer.y - pointer.downY) * 2);
            break;

        case 4:
            shape.scaleX = pointer.x - pointer.downX;
            shape.scaleY = pointer.y - pointer.downY;
            break;

        case 5:
            shape.setTo(0, 0, pointer.x - pointer.downX, pointer.y - pointer.downY);
            break;
    }
}

function drawStop ()
{
    isDown = false;

    shapes.push(shape);

    index++;
}

function setCircle ()
{
    if (isDown)
    {
        return;
    }

    current = 1;
    shape = null;
}

function setRectangle ()
{
    if (isDown)
    {
        return;
    }

    current = 2;
    shape = null;
}

function setEllipse ()
{
    if (isDown)
    {
        return;
    }

    current = 3;
    shape = null;
}

function setStar ()
{
    if (isDown)
    {
        return;
    }

    current = 4;
    shape = null;
}


function setLine ()
{
    if (isDown)
    {
        return;
    }

    current = 5;
    shape = null;
}

