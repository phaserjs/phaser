var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#080808',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var max = 16;
var emitters = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('spark0', 'assets/particles/blue.png');
    this.load.image('spark1', 'assets/particles/yellow.png');
    this.load.spritesheet('dragcircle', 'assets/sprites/dragcircle.png', { frameWidth: 16 });
}

function create ()
{
    var tempVec = new Phaser.Math.Vector2();

    var startPoint = new Phaser.Math.Vector2(50, 260);
    var controlPoint1 = new Phaser.Math.Vector2(610, 25);
    var controlPoint2 = new Phaser.Math.Vector2(320, 370);
    var endPoint = new Phaser.Math.Vector2(735, 550);

    curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);

    var spark0 = this.add.particles('spark0');
    var spark1 = this.add.particles('spark1');

    for (var c = 0; c <= max; c++)
    {
        var t = curve.getUtoTmapping(c / max);
        var p = curve.getPoint(t);
        var tangent = curve.getTangent(t);

        tempVec.copy(tangent).normalizeRightHand().scale(32).add(p);
        // tempVec.copy(tangent).scale(-32).add(p);

        var angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p, tempVec));

        var particles = (c % 2 === 0) ? spark0 : spark1;

        emitters.push(particles.createEmitter({
            x: p.x,
            y: p.y,
            angle: angle,
            speed: { min: 100, max: -500 },
            gravityY: 400,
            scale: { start: 0.2, end: 0.0 },
            lifespan: 1000,
            blendMode: 'ADD'
        }));
    }

    var point0 = this.add.image(startPoint.x, startPoint.y, 'dragcircle', 1).setInteractive();
    var point1 = this.add.image(endPoint.x, endPoint.y, 'dragcircle', 1).setInteractive();
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

        gameObject.getData('vector').set(dragX, dragY);

        for (var c = 0; c <= max; c++)
        {
            var t = curve.getUtoTmapping(c / max);
            var p = curve.getPoint(t);
            var tangent = curve.getTangent(t);

            emitters[c].setPosition(p.x, p.y);

            // tempVec.copy(tangent).scale(-32).add(p);
            tempVec.copy(tangent).normalizeRightHand().scale(32).add(p);

            var angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p, tempVec));

            emitters[c].setAngle(angle);
        }

    });

    this.input.on('dragEnd', function (pointer, gameObject) {

        if (gameObject.getData('isControl'))
        {
            gameObject.setFrame(2);
        }
        else
        {
            gameObject.setFrame(1);
        }

    });
}

function update ()
{
    emitters.forEach(function (emitter) {
        emitter.emitParticle();
    });
}
