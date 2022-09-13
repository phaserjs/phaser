var config = {
    type: Phaser.AUTO,
    backgroundColor: '#2dab2d',
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        width: '100%',
        height: '100%',
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1600,
            height: 1200
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('rain', 'assets/pics/thalion-rain.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo-x2.png');
}

function create ()
{
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'rain').setOrigin(0);
    this.logo = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'logo');

    this.scale.on('resize', resize, this);
}

function resize (gameSize, baseSize, displaySize, resolution)
{
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);

    this.bg.setSize(width, height);
    this.logo.setPosition(width / 2, height / 2);
}
