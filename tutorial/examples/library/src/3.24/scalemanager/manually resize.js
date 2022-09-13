var config = {
    type: Phaser.WEBGL,
    backgroundColor: '#2dab2d',
    scale: {
        mode: Phaser.Scale.NONE,
        parent: 'phaser-example',
        width: window.innerWidth,
        height: window.innerHeight
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
    var bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'rain').setOrigin(0);
    var logo = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'logo').setInteractive();

    logo.on('pointerover', function () {

        this.setTint(0xff0000);

    });

    logo.on('pointerout', function () {

        this.clearTint();

    });

    this.scale.on('resize', function (gameSize) {

        var width = gameSize.width;
        var height = gameSize.height;

        this.cameras.resize(width, height);

        bg.setSize(width, height);
        logo.setPosition(width / 2, height / 2);

    }, this);
}

//  In scaleMode NONE the Scale Manager is effectively disabled, so you need to
//  tell it when a resize happens yourself:

window.addEventListener('resize', function (event) {

    game.scale.resize(window.innerWidth, window.innerHeight);

}, false);
