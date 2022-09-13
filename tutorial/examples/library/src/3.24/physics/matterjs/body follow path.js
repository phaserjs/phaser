var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var curve;
var block;
var t = -1;
var duration = 5000;
var tempLine = new Phaser.Geom.Line();

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/flower-exo.png');
}

function create ()
{
    graphics = this.add.graphics();

    // let line = new Phaser.Geom.Line(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500));

    let line = new Phaser.Geom.Line(100, 500, 700, 100);

    // graphics.fillStyle(0xff0000, 1);
    // graphics.fillCircle(line.x1, line.y1, 8);
    // graphics.fillStyle(0xff00ff, 1);
    // graphics.fillCircle(line.x2, line.y2, 8);

    let points = [];

    points.push(line.getPointA());

    const length = Phaser.Geom.Line.Length(line);
    const waves = Math.ceil(length / 200);

    let vx = 100;
    let vy = 100;
    let prevX = line.x1;
    let prevY = line.y1;

    for (let i = 1; i <= waves; i++)
    {
        let currentPoint = line.getPoint(i / waves);

        // graphics.fillStyle(0xffff00).fillCircle(currentPoint.x, currentPoint.y, 4);

        let ray = new Phaser.Geom.Line(prevX, prevY, currentPoint.x, currentPoint.y);

        // graphics.lineStyle(1, 0xffffff).strokeLineShape(ray);

        let normal = Phaser.Geom.Line.GetNormal(ray);
        let midPoint = Phaser.Geom.Line.GetMidPoint(ray);

        // graphics.fillStyle(0x00ff00).fillCircle(midPoint.x + normal.x * vx, midPoint.y + normal.y * vy, 4);

        points.push(new Phaser.Math.Vector2(midPoint.x + normal.x * vx, midPoint.y + normal.y * vy));

        prevX = currentPoint.x;
        prevY = currentPoint.y;

        vx *= -1;
        vy *= -1;
    }

    points.push(line.getPointB());

    curve = new Phaser.Curves.Spline(points);

    graphics.lineStyle(1, 0xffffff, 1);
    curve.draw(graphics, 64);

    block = this.matter.add.image(line.x1, line.y1, 'block');

    block.setFriction(0);
    block.setFrictionAir(0);
    block.setBounce(0);

    this.input.once('pointerdown', function () {
        t = 0;
    }, this);
}

function update (time, delta)
{
    if (t === -1)
    {
        return;
    }

    t += delta;

    if (t >= duration)
    {
        //  Reached the end
        block.setVelocity(0, 0);
    }
    else
    {
        var d = (t / duration);

        var p = curve.getPoint(d);

        block.setPosition(p.x, p.y);
    }
}
