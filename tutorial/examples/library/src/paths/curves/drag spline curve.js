var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var path;
var curve;
var points;
var graphics;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('dragcircle', 'assets/sprites/dragcircle.png', { frameWidth: 16 });
}

function create ()
{
    path = { t: 0, vec: new Phaser.Math.Vector2() };

    curve = new Phaser.Curves.Spline([
        20, 550,
        260, 450,
        300, 250,
        550, 145,
        745, 256
    ]);

    points = curve.points;

    //  Create drag-handles for each point

    for (var i = 0; i < points.length; i++)
    {
        var point = points[i];

        var handle = this.add.image(point.x, point.y, 'dragcircle', 0).setInteractive();

        handle.setData('vector', point);

        this.input.setDraggable(handle);
    }

    this.input.on('dragstart', function (pointer, gameObject) {

        gameObject.setFrame(1);

    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

        gameObject.data.get('vector').set(dragX, dragY);

    });

    this.input.on('dragend', function (pointer, gameObject) {

        gameObject.setFrame(0);

    });

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 2000,
        yoyo: true,
        repeat: -1
    });

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
