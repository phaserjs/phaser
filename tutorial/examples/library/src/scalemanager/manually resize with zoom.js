var config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'phaser-example',
        width: 160,
        height: 144,
        zoom: Phaser.Scale.MAX_ZOOM
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/tests/zoom/background.png');
    this.load.image('ship', 'assets/tests/zoom/viper.png');
    this.load.image('bullet', 'assets/tests/zoom/bullet.png');
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    var bullet = this.add.image(-10, -10, 'bullet');

    var ship = this.add.image(40, 40, 'ship').setInteractive();

    var tween;

    ship.on('pointerdown', function ()
    {
        if (tween)
        {
            tween.stop();
        }

        bullet.setPosition(40, 40);

        tween = this.tweens.add({
            targets: bullet,
            x: 200
        });

    }, this);
}

//  In scaleMode NONE the Scale Manager is effectively disabled, so you need to
//  tell it when a resize happens yourself:

window.addEventListener('resize', function (event) {

    game.scale.setMaxZoom();

}, false);

document.body.style.backgroundColor = '#000000';
