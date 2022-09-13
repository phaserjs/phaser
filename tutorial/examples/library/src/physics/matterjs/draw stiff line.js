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
            debug: true
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

    var sides = 6;
    var size = 14;
    var distance = size * 2;
    var stiffness = 0.1;
    var lastPosition = new Phaser.Math.Vector2();
    var options = { friction: 0.005, frictionAir: 0, restitution: 1 };
    var pinOptions = { friction: 0, frictionAir: 0, restitution: 0, ignoreGravity: true, inertia: Infinity, isStatic: true };

    var current = null;
    var previous = null;

    this.input.on('pointerdown', function (pointer) {

        lastPosition.x = pointer.x;
        lastPosition.y = pointer.y;

        previous = this.matter.add.polygon(pointer.x, pointer.y, sides, size, pinOptions);

    }, this);

    this.input.on('pointermove', function (pointer) {

        if (pointer.isDown)
        {
            var x = pointer.x;
            var y = pointer.y;

            if (Phaser.Math.Distance.Between(x, y, lastPosition.x, lastPosition.y) > distance)
            {
                lastPosition.x = x;
                lastPosition.y = y;

                current = this.matter.add.polygon(pointer.x, pointer.y, sides, size, pinOptions);

                this.matter.add.constraint(previous, current, distance, stiffness);

                previous = current;
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
                ball.setFriction(0.005).setBounce(1);
            },
            callbackScope: this,
            repeat: 100
        });

    }, this);
}
