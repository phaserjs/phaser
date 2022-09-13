var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var fadeCamera;
var flashCamera;
var shakeCamera;

function preload ()
{
    this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
}

function create ()
{
    this.add.image(0, 0, 'CherilPerils');

    this.cameras.main.setViewport(5, 5, 390, 290);

    fadeCamera = this.cameras.add(405, 5, 390, 290);
    flashCamera = this.cameras.add(5, 305, 390, 290);
    shakeCamera = this.cameras.add(405, 305, 390, 290);

    fadeCamera.fade(2000);

    flashCamera.flash(1000);
}

function update ()
{
    // flashCamera.flash(750);
    shakeCamera.shake(1000, 0.025);

    if (fadeCamera.fadeEffect.alpha >= 1)
    {
        fadeCamera.fadeEffect.alpha = 0;
        fadeCamera.fade(2000);
    }
}
