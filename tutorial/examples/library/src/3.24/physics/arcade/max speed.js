var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;
var circle;
var cursors;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/games/asteroids/ship.png');
}

function create ()
{
    sprite = this.physics.add.image(400, 300, 'ship');

    sprite.body.setMaxSpeed(200);

    circle = this.add.circle(sprite.x, sprite.y, 0.5 * sprite.body.maxSpeed, 0xffffff, 0.2);

    console.log(circle);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    if (cursors.up.isDown)
    {
        this.physics.velocityFromRotation(sprite.rotation, sprite.body.maxSpeed, sprite.body.acceleration);
    }
    else
    {
        sprite.setAcceleration(0);
    }

    if (cursors.left.isDown)
    {
        sprite.setAngularVelocity(-300);
    }
    else if (cursors.right.isDown)
    {
        sprite.setAngularVelocity(300);
    }
    else
    {
        sprite.setAngularVelocity(0);
    }

    text.setText('Speed: ' + sprite.body.speed);

    this.physics.world.wrap(sprite, 100);

    circle.setPosition(sprite.x, sprite.y);
}
