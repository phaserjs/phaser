var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#9adaea',
    useTicker: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bullet1;
var bullet2;

var speed1;
var speed2;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bullet', 'assets/tests/timer/bullet-bill.png');
    this.load.image('cannon', 'assets/tests/timer/cannon.png');
    this.load.image('ground', 'assets/tests/timer/ground.png');
}

function create ()
{
    //   Bullet 1 (600px in 6 seconds)

    this.add.image(0, 200, 'ground').setOrigin(0);

    bullet1 = this.add.image(64, 76, 'bullet').setOrigin(0);

    speed1 = Phaser.Math.GetSpeed(600, 6);

    this.add.image(64, 72, 'cannon').setOrigin(0);

    this.add.text(64, 50, '600px / 6 secs', { fill: '#000' });

    //   Bullet 2 (600px in 3 seconds)

    this.add.image(0, 500, 'ground').setOrigin(0);

    bullet2 = this.add.image(64, 376, 'bullet').setOrigin(0);

    speed2 = Phaser.Math.GetSpeed(600, 3);

    this.add.image(64, 500, 'cannon').setOrigin(0, 1);

    this.add.text(64, 350, '600px / 3 secs', { fill: '#000' });
}

//  The update function is passed 2 values:
//  The current time (in ms)
//  And the delta time, which is derived from the elapsed time since the last frame, with some smoothing and range clamping applied

function update (time, delta)
{
    bullet1.x += speed1 * delta;

    if (bullet1.x > 864)
    {
        bullet1.x = 64;
    }

    bullet2.x += speed2 * delta;

    if (bullet2.x > 864)
    {
        bullet2.x = 64;
    }
}
