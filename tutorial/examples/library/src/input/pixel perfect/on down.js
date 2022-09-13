var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('logoAlpha', 'assets/sprites/phaser3-logo-alpha.png');
}

function create ()
{
    //  This sprite is clickable on any pixel that has an alpha value >= 1
    var sprite1 = this.add.sprite(400, 200, 'logo').setInteractive({ pixelPerfect: true });

    //  This sprite is clickable on any pixel that has an alpha value >= 100 (i.e. the left side of the sprite)
    var sprite2 = this.add.sprite(400, 400, 'logoAlpha').setInteractive(this.input.makePixelPerfect(100));

    var text = this.add.text(10, 10, 'Click either of the sprites', { font: '16px Courier', fill: '#000000' });

    sprite1.on('pointerdown', function () {

        text.setText('Clicked Sprite 1');

    });

    sprite2.on('pointerdown', function () {

        text.setText('Clicked Sprite 2');

    });
}
