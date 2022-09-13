var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var logo = null;

var maxY = 0;
var minY = 600;
var lastY = 0;
var duration = 0;
var prevDuration = 0;
var prevDirection = null;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('marker', 'assets/sprites/longarrow.png');
}

function create ()
{
    logo = this.physics.add.image(400, 100, 'logo');

    logo.setOrigin(0.5, 0);
    logo.setVelocity(0, 60);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    lastY = logo.y;

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    // this.physics.world.timeScale = 0.1;

    this.sys.events.on('postupdate', update, this);
}

function update (time, delta)
{
    text.setText([
        'steps: ' + this.physics.world._lastCount,
        'duration: ' + prevDuration,
        'last y: ' + lastY,
        'min y: ' + minY,
        'max y: ' + maxY
    ]);

    if (Phaser.Math.Fuzzy.LessThan(logo.body.velocity.y, 0, 0.1))
    {
        direction = 'up';
    }
    else
    {
        direction = 'down';
    }

    if (prevDirection !== direction && prevDirection === 'up')
    {
        var marker = this.add.sprite(0, logo.y + 18, 'marker');

        marker.setOrigin(0, 1);

        lastY = logo.y;

        prevDuration = duration;
        duration = 0;
    }

    prevDirection = direction;
    duration += delta;

    minY = Math.min(minY, logo.y);
    maxY = Math.max(minY, maxY, lastY);
}
