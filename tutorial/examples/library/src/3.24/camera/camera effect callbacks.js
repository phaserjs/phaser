var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);
var camera;

function flashComplete ()
{
    console.log('Flash completed. Starting shake effect.');

    camera.shake(1000, 0.05, false, shakeComplete);
}

function shakeComplete ()
{
    console.log('Shake completed. Starting fade effect.');

    camera.fade(1000, 0, 0, 0, false, fadeComplete);
}

function fadeComplete ()
{
    console.log('Fade completed. End of example.');
}

function preload()
{
    this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
}

function create()
{
    var image = this.add.image(0, 0, 'CherilPerils')

    this.cameras.main.setViewport(5, 5, 390, 290);

    camera = this.cameras.add(5, 5, 390, 290);

    camera.flash(1000, 1.0, 1.0, 1.0, false, flashComplete);
}
