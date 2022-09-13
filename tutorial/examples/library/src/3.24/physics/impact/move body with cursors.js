var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 800,
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('platform', 'assets/sprites/platform.png');
}

function create ()
{
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ]
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.impact.world.setBounds();

    //  A few platforms
    this.impact.add.image(200, 300, 'platform').setFixedCollision().setGravity(0).setBodyScale(0.5);
    this.impact.add.image(550, 190, 'platform').setFixedCollision().setGravity(0).setBodyScale(0.4);
    this.impact.add.image(900, 300, 'platform').setFixedCollision().setGravity(0).setBodyScale(0.5);
    this.impact.add.image(800, 400, 'platform').setFixedCollision().setGravity(0).setBodyScale(0.5);
    this.impact.add.image(700, 500, 'platform').setFixedCollision().setGravity(0).setBodyScale(0.5);

    //  Our sprite
    player = this.impact.add.sprite(200, 200, 'dude', 4).setOrigin(0, 0.15);

    player.setActiveCollision();
    player.setMaxVelocity(500);
    player.setFriction(1000, 100);

    player.body.accelGround = 1200;
    player.body.accelAir = 600;
    player.body.jumpSpeed = 500;

    cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta)
{
    var accel = player.body.standing ? player.body.accelGround : player.body.accelAir;

    if (cursors.left.isDown)
    {
        player.setAccelerationX(-accel);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setAccelerationX(accel);

        player.anims.play('right', true);
    }
    else
    {
        player.setAccelerationX(0);
    }

    if (player.vel.x === 0)
    {
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.standing)
    {
        player.setVelocityY(-player.body.jumpSpeed);
    }
}
