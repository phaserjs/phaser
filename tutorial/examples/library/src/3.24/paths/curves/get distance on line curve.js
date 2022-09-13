var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    var curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(100, 200), new Phaser.Math.Vector2(600, 400));

    graphics.clear();
    graphics.lineStyle(2, 0xffffff, 1);

    curve.draw(graphics);

    //  Get the t value for 200 pixels along the curve
    var t = curve.getTFromDistance(200);

    //  Get the point at t
    var p = curve.getPoint(t);

    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(p.x, p.y, 8);
}
