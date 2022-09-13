var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    physics: {
        default: 'impact'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var t = 0;
var curve;
var points;
var ship;
var tempVec;
var tempVecP;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/sprites/lemming.png');
}

function create ()
{
    // var p0 = new Phaser.Math.Vector2(100, 500);
    // var p1 = new Phaser.Math.Vector2(50, 100);
    // var p2 = new Phaser.Math.Vector2(600, 100);
    // var p3 = new Phaser.Math.Vector2(750, 300);
    // curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

    curve = new Phaser.Curves.Ellipse(400, 300, 200);

    points = curve.getSpacedPoints(32);

    tempVec = new Phaser.Math.Vector2();
    tempVecP = new Phaser.Math.Vector2();

    ship = this.impact.add.image(points[0].x, points[0].y, 'ship');

    nextPoint(this);
}

function nextPoint (scene)
{
    var next = points[t % points.length]; 

    moveToXY(ship, next.x, next.y, 0, 500);

    t++;

    scene.time.addEvent({ delay: 500, callback: nextPoint, callbackScope: scene, args: [ scene ] });
}

function moveToXY (gameObject, x, y, speed, maxTime)
{
    if (speed === undefined) { speed = 60; }
    if (maxTime === undefined) { maxTime = 0; }

    var angle = Math.atan2(y - gameObject.y, x - gameObject.x);

    if (maxTime > 0)
    {
        //  We know how many pixels we need to move, but how fast?
        var dx = gameObject.x - x;
        var dy = gameObject.y - y;

        speed = Math.sqrt(dx * dx + dy * dy) / (maxTime / 1000);
    }

    gameObject.setVelocityX(Math.cos(angle) * speed);
    gameObject.setVelocityY(Math.sin(angle) * speed);

    // gameObject.rotation = angle;
}

function update ()
{
    // var t = curve.getUtoTmapping(map.u);

    // curve.getPoint(t + 0.1, tempVecP);
    // curve.getTangent(t, tempVec);

    // tempVec.scale(180);

    // ship.setVelocity(tempVec.x, tempVec.y);

    // ship.rotation = Phaser.Math.Angle.Between(ship.x, ship.y, tempVecP.x, tempVecP.y);
}
