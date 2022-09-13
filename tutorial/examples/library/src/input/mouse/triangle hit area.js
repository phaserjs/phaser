var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    pixelArt: true,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/sprites/thrust_ship2.png');
}

function create ()
{
    var sprite = this.add.sprite(400, 300, 'ship').setScale(8);

    var shape = new Phaser.Geom.Triangle.BuildEquilateral(16, 0, 30);

    sprite.setInteractive(shape, Phaser.Geom.Triangle.Contains);

    //  Input Event listeners

    sprite.on('pointerover', function () {

        this.setTint(0x7878ff);

    });

    sprite.on('pointerout', function () {

        this.clearTint();

    });
}
