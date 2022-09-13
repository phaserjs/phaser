var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d8d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image;
var container;
var bounds;
var graphics;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('disk', 'assets/sprites/copy-that-floppy.png');
}

function create ()
{
    image = this.add.image(0, 0, 'disk');

    container = this.add.container(0, 0, [ image ]);

    var container2 = this.add.container(400, 300, [ container ]);

    graphics = this.add.graphics();

    bounds = image.getBounds();

    this.tweens.add({

        targets: container2,
        duration: 2000,
        scaleX: 2,
        scaleY: 2,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true

    });
}

function update ()
{
    container.rotation += 0.015;

    bounds = image.getBounds();

    graphics.clear();
    graphics.lineStyle(1, 0xffff00);
    graphics.strokeRectShape(bounds);
}
