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
    graphics = this.add.graphics();

    path = { t: 0, vec: new Phaser.Math.Vector2() };

    var startPoint = new Phaser.Math.Vector2(50, 260);
    var controlPoint1 = new Phaser.Math.Vector2(610, 25);
    var controlPoint2 = new Phaser.Math.Vector2(320, 370);
    var endPoint = new Phaser.Math.Vector2(735, 550);

    curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);

    points = curve.getSpacedPoints(32);

    var point0 = this.add.image(startPoint.x, startPoint.y, 'dragcircle', 0).setInteractive();
    var point1 = this.add.image(endPoint.x, endPoint.y, 'dragcircle', 0).setInteractive();
    var point2 = this.add.image(controlPoint1.x, controlPoint1.y, 'dragcircle', 2).setInteractive();
    var point3 = this.add.image(controlPoint2.x, controlPoint2.y, 'dragcircle', 2).setInteractive();

    point0.setData('vector', startPoint);
    point1.setData('vector', endPoint);
    point2.setData('vector', controlPoint1);
    point3.setData('vector', controlPoint2);

    point0.setData('isControl', false);
    point1.setData('isControl', false);
    point2.setData('isControl', true);
    point3.setData('isControl', true);

    this.input.setDraggable([ point0, point1, point2, point3 ]);

    this.input.on('dragstart', function (pointer, gameObject) {

        gameObject.setFrame(1);

    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

        gameObject.data.get('vector').set(dragX, dragY);

        //  Get 32 points equally spaced out along the curve
        points = curve.getSpacedPoints(32);

    });

    this.input.on('dragend', function (pointer, gameObject) {

        if (gameObject.data.get('isControl'))
        {
            gameObject.setFrame(2);
        }
        else
        {
            gameObject.setFrame(0);
        }

    });

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 2000,
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    graphics.clear();

    //  Draw the curve through the points
    graphics.lineStyle(1, 0xff00ff, 1);

    curve.draw(graphics);

    //  Draw t
    curve.getPoint(path.t, path.vec);

    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(path.vec.x, path.vec.y, 16);
}
