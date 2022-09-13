var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
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

var ship;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/tests/space/nebula.jpg');
    this.load.atlas('space', 'assets/tests/space/space.png', 'assets/tests/space/space.json');
}

function create ()
{
    this.add.image(400, 300, 'background');

    var particles = this.add.particles('space');

    var emitter = particles.createEmitter({
        frame: 'blue',
        speed: {
            onEmit: function (particle, key, t, value)
            {
                return ship.body.speed;
            }
        },
        lifespan: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(ship.body.speed, 0, 300) * 20000;
            }
        },
        alpha: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(ship.body.speed, 0, 300) * 1000;
            }
        },
        scale: { start: 1.0, end: 0 },
        blendMode: 'ADD'
    });

    ship = this.matter.add.image(400, 300, 'space', 'ship');

    ship.setFixedRotation();
    ship.setAngle(270);
    ship.setFrictionAir(0.05);
    ship.setMass(30);

    emitter.startFollow(ship);

    this.matter.world.setBounds(0, 0, 800, 600);

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if (cursors.left.isDown)
    {
        ship.thrustLeft(0.1);
    }
    else if (cursors.right.isDown)
    {
        ship.thrustRight(0.1);
    }

    if (cursors.up.isDown)
    {
        ship.thrust(0.1);
    }
    else if (cursors.down.isDown)
    {
        ship.thrustBack(0.1);
    }
}
