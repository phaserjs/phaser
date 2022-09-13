var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0.8
            },
            enableSleep: true,
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/pangball.png');
}

function create ()
{
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

    var lineCategory = this.matter.world.nextCategory();
    var ballsCategory = this.matter.world.nextCategory();

    var sides = 4;
    var size = 14;
    var distance = size;
    var stiffness = 0.1;
    var lastPosition = new Phaser.Math.Vector2();
    var options = { friction: 0, frictionAir: 0, restitution: 0, ignoreGravity: true, inertia: Infinity, isStatic: true, angle: 0, collisionFilter: { category: lineCategory } };

    var current = null;
    var previous = null;

    var curves = [];
    var curve = null;

    var graphics = this.add.graphics();

    this.input.on('pointerdown', function (pointer) {

        lastPosition.x = pointer.x;
        lastPosition.y = pointer.y;

        previous = this.matter.add.polygon(pointer.x, pointer.y, sides, size, options);

        curve = new Phaser.Curves.Spline([ pointer.x, pointer.y ]);

        curves.push(curve);

    }, this);

    this.input.on('pointermove', function (pointer) {

        if (pointer.isDown)
        {
            var x = pointer.x;
            var y = pointer.y;

            if (Phaser.Math.Distance.Between(x, y, lastPosition.x, lastPosition.y) > distance)
            {
                options.angle = Phaser.Math.Angle.Between(x, y, lastPosition.x, lastPosition.y);

                lastPosition.x = x;
                lastPosition.y = y;

                current = this.matter.add.polygon(pointer.x, pointer.y, sides, size, options);

                this.matter.add.constraint(previous, current, distance, stiffness);

                previous = current;

                curve.addPoint(x, y);

                graphics.clear();
                graphics.lineStyle(size * 1.5, 0xffffff);

                curves.forEach(function(c) {
                    c.draw(graphics, 64);
                });
            }
        }

    }, this);

    this.input.once('pointerup', function (pointer) {

        this.time.addEvent({
            delay: 1000,
            callback: function ()
            {
                var ball = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0), 'ball');

                ball.setCircle();
                ball.setCollisionCategory(ballsCategory);
                ball.setFriction(0.005).setBounce(0.9);
            },
            callbackScope: this,
            repeat: 100
        });

    }, this);
}
