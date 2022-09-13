var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.innerWidth,
    height: window.innerHeight,
    autoResize: true,
    scene: {
        preload: preload,
        create: create,
        resize: resize
    }
};

function preload ()
{
    this.load.image('rain', 'assets/pics/thalion-rain.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo-x2.png');
}

function create ()
{
    this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'rain').setOrigin(0);
    this.logo = this.add.sprite(game.config.width / 2, game.config.height / 2, 'logo');

    this.events.on('resize', resize, this);
}

function resize (width, height)
{
    if (width === undefined) { width = this.sys.game.config.width; }
    if (height === undefined) { height = this.sys.game.config.height; }

    this.cameras.resize(width, height);

    this.bg.setSize(width, height);
    this.logo.setPosition(width / 2, height / 2);
}

var game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {

    game.resize(window.innerWidth, window.innerHeight);

}, false);
