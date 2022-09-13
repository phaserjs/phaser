var config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: 1,
        width: 640,
        height: 256
    },
    scene: {
        preload: preload,
        create: create
    }
};

var ship;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/spaceship.png');
}

function create ()
{
    ship = this.add.image(0, 0, 'pic').setOrigin(0);

    text = this.add.text(320, 128, 'Please set your\nphone to landscape', { font: '48px Courier', fill: '#00ff00', align: 'center' }).setOrigin(0.5);

    checkOriention(this.scale.orientation);

    this.scale.on('orientationchange', checkOriention, this);
}

function checkOriention (orientation)
{
    if (orientation === Phaser.Scale.PORTRAIT)
    {
        ship.alpha = 0.2;
        text.setVisible(true);
    }
    else if (orientation === Phaser.Scale.LANDSCAPE)
    {
        ship.alpha = 1;
        text.setVisible(false);
    }
}
