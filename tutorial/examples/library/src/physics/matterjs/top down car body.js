var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: false,
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

var car;
var tracker1;
var tracker2;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('soil', 'assets/textures/soil.png');
    this.load.image('car', 'assets/sprites/car-yellow.png');
}

function create ()
{
    this.add.tileSprite(400, 300, 800, 600, 'soil');

    car = this.matter.add.image(400, 300, 'car');
    car.setAngle(-90);
    car.setFrictionAir(0.1);
    car.setMass(10);

    this.matter.world.setBounds(0, 0, 800, 600);

    tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
    tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    var point1 = car.getTopRight();
    var point2 = car.getBottomRight();

    tracker1.setPosition(point1.x, point1.y);
    tracker2.setPosition(point2.x, point2.y);

    var speed = 0.25;
    // var angle = { x: speed * Math.cos(car.body.angle), y: speed * Math.sin(car.body.angle) };
    // var angle = { x: 0, y: 0 };

    if (cursors.left.isDown)
    {
        car.applyForceFrom({ x: point1.x, y: point1.y }, { x: -speed * Math.cos(car.body.angle), y: 0 });

        // Phaser.Physics.Matter.Matter.Body.setAngularVelocity(car.body, -0.05);
        // car.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        car.applyForceFrom({ x: point2.x, y: point2.y }, { x: speed * Math.cos(car.body.angle), y: 0 });

        // car.applyForceFrom();
        // Phaser.Physics.Matter.Matter.Body.setAngularVelocity(car.body, 0.05);
        // car.angle += 4;
    }

    if (cursors.up.isDown)
    {
        car.thrust(0.025);
    }
    else if (cursors.down.isDown)
    {
        car.thrustBack(0.1);
    }
}
