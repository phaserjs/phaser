var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            createSlider: createSlider
        }
    }
};

var path;
var curve;
var text;
var graphics;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('dragcircle', 'assets/sprites/dragcircle.png', { frameWidth: 16 });
}

function createSlider (graphics, x, y, label, width, min, max, value, callback)
{
    //  Default value
    value = Phaser.Math.Clamp(value, min, max);

    graphics.lineStyle(1, 0xffffff, 1);
    graphics.lineBetween(x, y + 8, x + width, y + 8);

    var text = this.add.text(x - 10, y, label + ':', { font: '16px Courier', fill: '#00ff00' }).setOrigin(1, 0);
    var textValue = this.add.text(x + width + 10, y, value.toFixed(2), { font: '16px Courier', fill: '#00ff00' });

    var image = this.add.image(x, y + 8, 'dragcircle', 0).setInteractive();

    image.setData('labelValue', textValue);

    image.setData('left', x);
    image.setData('right', x + width);

    this.input.setDraggable(image);

    //  Drag limits

    image.setData('label', label);

    //  The range the control is allowed to be within (the actual values, not the percentage or pixels)
    image.setData('min', min);
    image.setData('max', max);
    image.setData('value', value);

    //  The scale is how many pixels = 1 unit of range
    var scale = max / width;

    image.setData('scale', scale);

    var p = Phaser.Math.Percent(value, min, max);

    // console.log('width', width);
    // console.log('min', min);
    // console.log('max', max);
    // console.log('value', value, 'p:', p, '%');
    // console.log('scale', scale);

    image.x += p * width;

    image.setData('callback', callback);

    image.on('drag', function (pointer, dragX, dragY) {

        var min = this.getData('min');
        var max = this.getData('max');
        var scale = this.getData('scale');
        var left = this.getData('left');
        var right = this.getData('right');

        dragX = Phaser.Math.Clamp(dragX, left, right);

        this.x = dragX;

        //  Calculate the value
        var value = (dragX - left) * scale;

        this.setData('value', value);

        this.getData('labelValue').setText(value.toFixed(2));

        var callback = this.getData('callback');

        callback.call(curve, value);

    });

    // this.input.setOnDragCallback(image, updateSlider, this);
}

function updateSlider (handle, pointer, dragX, dragY)
{
    var min = handle.getData('min');
    var max = handle.getData('max');
    var scale = handle.getData('scale');
    var left = handle.getData('left');
    var right = handle.getData('right');

    dragX = Phaser.Math.Clamp(dragX, left, right);

    handle.x = dragX;

    //  Calculate the value
    var value = (dragX - left) * scale;

    handle.setData('value', value);

    handle.getData('labelValue').setText(value.toFixed(2));

    var callback = handle.getData('callback');

    callback.call(curve, value);
}

function create ()
{
    var sliderGraphics = this.add.graphics();

    path = { t: 0, vec: new Phaser.Math.Vector2() };

    curve = new Phaser.Curves.Ellipse(400, 300, 100, 150);

    this.createSlider(sliderGraphics, 100, 10, 'width', 500, 0, 400, 100, curve.setXRadius);
    this.createSlider(sliderGraphics, 100, 30, 'height', 500, 0, 300, 150, curve.setYRadius);
    this.createSlider(sliderGraphics, 100, 50, 'start', 500, 0, 360, 0, curve.setStartAngle);
    this.createSlider(sliderGraphics, 100, 70, 'end', 500, 0, 360, 360, curve.setEndAngle);
    this.createSlider(sliderGraphics, 100, 90, 'angle', 500, 0, 360, 0, curve.setRotation);

    var centerPoint = this.add.image(curve.p0.x, curve.p0.y, 'dragcircle', 0).setInteractive();
    centerPoint.setData('control', 'center').setData('vector', curve.p0);
    this.input.setDraggable(centerPoint);

    this.input.on('dragstart', function (pointer, gameObject) {

        gameObject.setFrame(1);

    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        if (gameObject.data.get('control') === 'center')
        {
            gameObject.x = dragX;
            gameObject.y = dragY;

            gameObject.data.get('vector').set(dragX, dragY);
        }

    });

    this.input.on('dragend', function (pointer, gameObject) {

        gameObject.setFrame(0);

    });

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Linear',
        duration: 4000,
        repeat: -1
    });

    //  Debug graphics
    graphics = this.add.graphics();
}

function update ()
{
    graphics.clear();

    graphics.lineStyle(2, 0xffffff, 1);

    curve.draw(graphics, 64);

    curve.getPoint(path.t, path.vec);

    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(path.vec.x, path.vec.y, 8);
}
