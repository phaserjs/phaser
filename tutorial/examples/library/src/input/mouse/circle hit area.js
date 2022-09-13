var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/wizball.png');
}

function create ()
{
    var sprite = this.add.sprite(400, 300, 'ball').setScale(2);

    //  The circle x/y relates to the top-left of the sprite.
    //  So if you want the circle positioned in the middle then you need to offset it by half the sprite width/height:
    var shape = new Phaser.Geom.Circle(46, 45, 45);

    sprite.setInteractive(shape, Phaser.Geom.Circle.Contains);

    //  Input Event listeners

    sprite.on('pointerover', function () {

        sprite.setTint(0x7878ff);

    });

    sprite.on('pointerout', function () {

        sprite.clearTint();

    });
}
