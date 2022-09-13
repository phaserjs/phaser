var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;
var cursors;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bullet', 'assets/games/asteroids/bullets.png');
    this.load.image('ship', 'assets/games/asteroids/ship.png');
}

function create ()
{
    sprite = this.physics.add.image(400, 300, 'ship');

    sprite.setDamping(true);
    sprite.setDrag(0.99);
    sprite.setMaxVelocity(200);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    if (cursors.up.isDown)
    {
        this.physics.velocityFromRotation(sprite.rotation, 200, sprite.body.acceleration);
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

    // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    // {
    //     fireBullet();
    // }

    this.physics.world.wrap(sprite, 32);

    // bullets.forEachExists(screenWrap, this);
}
