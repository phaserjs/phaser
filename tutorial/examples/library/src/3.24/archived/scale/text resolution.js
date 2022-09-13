var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0056a4',
    width: 800,
    height: 600,
    _resolution: window.devicePixelRatio,
    resolution: 2,
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
    // this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'rain').setOrigin(0);
    // this.logo = this.add.sprite(game.config.width / 2, game.config.height / 2, 'logo');

    // this.add.text(10, 10, 'ABCDESHZ',  { fontFamily: 'Arial', fontSize: 128, color: '#ffffff', fontStyle: 'bold' })
    this.add.text(10, 10, 'LOW',  { fontFamily: 'Arial', fontSize: 260, color: '#ffffff', fontStyle: 'bold', resolution: 1 })

    this.add.text(10, 300, 'HIGH',  { fontFamily: 'Arial', fontSize: 260, color: '#ffffff', fontStyle: 'bold' })

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

    // game.resize(window.innerWidth, window.innerHeight);

}, false);
