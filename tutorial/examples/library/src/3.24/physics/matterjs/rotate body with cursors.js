var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
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
    this.load.image('ship', 'assets/sprites/x2kship.png');
    this.load.image('blue', 'assets/particles/blue.png');
}

function create ()
{
    var particles = this.add.particles('blue');

    ship = this.matter.add.image(400, 300, 'ship');

    ship.setFrictionAir(0.1);
    ship.setMass(30);
    ship.setFixedRotation();

    var emitter = particles.createEmitter({
        speed: {
            onEmit: function (particle, key, t, value)
            {
                return ship.body.speed * 10;
            }
        },
        lifespan: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(ship.body.speed, 0, 300) * 40000;
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

    emitter.startFollow(ship);

    this.matter.world.setBounds(0, 0, 800, 600);

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if (cursors.left.isDown)
    {
        ship.setAngularVelocity(-0.1);
    }
    else if (cursors.right.isDown)
    {
        ship.setAngularVelocity(0.1);
    }

    if (cursors.up.isDown)
    {
        ship.thrust(0.08);
    }
}
