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
    //  This sprite is draggable from any pixel that has an alpha value >= 1
    var sprite1 = this.add.sprite(400, 200, 'logo').setInteractive({ pixelPerfect: true, draggable: true });

    //  This sprite is draggable from any pixel that has an alpha value >= 120 (i.e. the left side of the sprite)
    var sprite2 = this.add.sprite(400, 400, 'logoAlpha').setInteractive({ pixelPerfect: true, alphaTolerance: 120, draggable: true });

    sprite1.on('drag', function (pointer, dragX, dragY) {

        this.x = dragX;
        this.y = dragY;

    });

    sprite2.on('drag', function (pointer, dragX, dragY) {

        this.x = dragX;
        this.y = dragY;

    });
}
