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
var bounds;
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

    bounds = new Phaser.Geom.Rectangle();

    curve = new Phaser.Curves.Line([ 100, 100, 600, 400 ]);
    // curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(100, 100), new Phaser.Math.Vector2(600, 400));

    curve.getBounds(bounds);

    var point0 = this.add.image(curve.p0.x, curve.p0.y, 'dragcircle', 0).setInteractive();
    var point1 = this.add.image(curve.p1.x, curve.p1.y, 'dragcircle', 0).setInteractive();

    point0.data.set('vector', curve.p0);
    point1.data.set('vector', curve.p1);

    this.input.setDraggable([ point0, point1 ]);

    this.input.on('DRAG_START_EVENT', function (event) {

        event.gameObject.setFrame(1);

    });

    this.input.on('DRAG_EVENT', function (event) {

        event.gameObject.x = event.dragX;
        event.gameObject.y = event.dragY;

        event.gameObject.data.get('vector').set(event.dragX, event.dragY);

        curve.getBounds(bounds);

    });

    this.input.on('DRAG_END_EVENT', function (event) {

        event.gameObject.setFrame(0);

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

    //  Draw the bounds
    graphics.lineStyle(1, 0x00ff00, 1).strokeRectShape(bounds);

    //  Draw the curve
    graphics.lineStyle(2, 0xffffff, 1);

    curve.draw(graphics);

    //  Draw the follower
    curve.getPoint(path.t, path.vec);

    graphics.fillStyle(0xffff00, 1);
    graphics.fillRect(path.vec.x - 8, path.vec.y - 8, 16, 16);
}
