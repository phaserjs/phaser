var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.image('spark0', 'assets/particles/blue.png');
    this.load.image('spark1', 'assets/particles/red.png');
    this.load.image('logo', 'assets/sprites/phaser2.png');
}

function create ()
{
    var p0 = new Phaser.Math.Vector2(200, 500);
    var p1 = new Phaser.Math.Vector2(200, 200);
    var p2 = new Phaser.Math.Vector2(600, 200);
    var p3 = new Phaser.Math.Vector2(600, 500);

    var curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

    var max = 28;
    var points = [];
    var tangents = [];

    for (var c = 0; c <= max; c++)
    {
        var t = curve.getUtoTmapping(c / max);

        points.push(curve.getPoint(t));
        tangents.push(curve.getTangent(t));
    }

    var tempVec = new Phaser.Math.Vector2();

    var spark0 = this.add.particles('spark0');
    var spark1 = this.add.particles('spark1');

    for (var i = 0; i < points.length; i++)
    {
        var p = points[i];

        tempVec.copy(tangents[i]).normalizeRightHand().scale(-32).add(p);

        var angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p, tempVec));

        var particles = (i % 2 === 0) ? spark0 : spark1;

        particles.createEmitter({
            x: tempVec.x,
            y: tempVec.y,
            angle: angle,
            speed: { min: -100, max: 500 },
            gravityY: 200,
            scale: { start: 0.4, end: 0.1 },
            lifespan: 800,
            blendMode: 'SCREEN'
        });
    }

    this.add.image(400, 400, 'logo');
}
