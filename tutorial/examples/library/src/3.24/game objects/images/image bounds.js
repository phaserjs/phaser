var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image1;
var image2;
var image3;

var bounds1;
var bounds2;
var bounds3;

var graphics;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
    this.load.image('disk', 'assets/sprites/copy-that-floppy.png');
    this.load.image('tetris', 'assets/sprites/tetrisblock1.png');
}

function create ()
{
    image1 = this.add.image(700, 200, 'eye');
    image2 = this.add.image(180, 180, 'tetris');
    image3 = this.add.image(400, 500, 'disk');

    image1.setOrigin(1);
    image2.setOrigin(0);
    image3.setOrigin(0.5);

    image3.setScale(0.5);

    graphics = this.add.graphics();

    bounds1 = image1.getBounds();
    bounds2 = image2.getBounds();
    bounds3 = image3.getBounds();

    this.tweens.add({

        targets: image3,
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
    image1.rotation += 0.013;
    image2.rotation += 0.015;
    image3.rotation -= 0.010;

    bounds1 = image1.getBounds();
    bounds2 = image2.getBounds();
    bounds3 = image3.getBounds();

    graphics.clear();

    graphics.lineStyle(1, 0xff0000);
    graphics.strokeRectShape(bounds1);

    graphics.lineStyle(1, 0xffff00);
    graphics.strokeRectShape(bounds2);

    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRectShape(bounds3);
}
