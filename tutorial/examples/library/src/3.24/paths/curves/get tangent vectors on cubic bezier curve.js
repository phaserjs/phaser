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
    graphics = this.add.graphics();

    var p0 = new Phaser.Math.Vector2(100, 500);
    var p1 = new Phaser.Math.Vector2(50, 100);
    var p2 = new Phaser.Math.Vector2(600, 100);
    var p3 = new Phaser.Math.Vector2(700, 500);

    var curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

    var max = 16;
    var points = [];
    var tangents = [];

    for (var c = 0; c <= max; c++)
    {
        var t = curve.getUtoTmapping(c / max);

        points.push(curve.getPoint(t));
        tangents.push(curve.getTangent(t));
    }

    var tempVec = new Phaser.Math.Vector2();

    //  Draw the points
    graphics.fillStyle(0xff0000, 1);

    for (var i = 0; i < points.length; i++)
    {
        var p = points[i];

        graphics.fillCircle(p.x, p.y, 6);

        //  Draw the tangent vector
        tempVec.copy(tangents[i]).scale(32).add(p);

        graphics.lineStyle(1, 0x00ff00, 1);
        graphics.lineBetween(p.x, p.y, tempVec.x, tempVec.y);

        //  Draw the right-hand tangent vector
        tempVec.copy(tangents[i]).normalizeRightHand().scale(-32).add(p);

        graphics.lineStyle(1, 0xff00ff, 1);
        graphics.lineBetween(p.x, p.y, tempVec.x, tempVec.y);
    }
}
