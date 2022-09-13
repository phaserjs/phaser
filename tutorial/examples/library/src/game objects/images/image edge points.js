var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image1;
var graphics;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
}

function create ()
{
    image1 = this.add.image(400, 300, 'logo');

    image1.setScale(0.5);

    this.tweens.add({

        targets: image1,
        duration: 2000,
        scaleX: 2,
        scaleY: 4,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true

    });

    graphics = this.add.graphics();
}

function update ()
{
    graphics.clear();

    var topLeft = image1.getTopLeft();

    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(topLeft.x, topLeft.y, 6, 6);

    var topCenter = image1.getTopCenter();

    graphics.fillStyle(0xf0ff0f, 1);
    graphics.fillRect(topCenter.x, topCenter.y, 6, 6);

    var topRight = image1.getTopRight();

    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(topRight.x, topRight.y, 6, 6);

    var leftCenter = image1.getLeftCenter();

    graphics.fillStyle(0xff00ff, 1);
    graphics.fillRect(leftCenter.x, leftCenter.y, 6, 6);

    var rightCenter = image1.getRightCenter();

    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(rightCenter.x, rightCenter.y, 6, 6);

    var bottomLeft = image1.getBottomLeft();

    graphics.fillStyle(0xff00ff, 1);
    graphics.fillRect(bottomLeft.x, bottomLeft.y, 6, 6);

    var bottomCenter = image1.getBottomCenter();

    graphics.fillStyle(0x00fff0, 1);
    graphics.fillRect(bottomCenter.x, bottomCenter.y, 6, 6);

    var bottomRight = image1.getBottomRight();

    graphics.fillStyle(0x0000ff, 1);
    graphics.fillRect(bottomRight.x, bottomRight.y, 6, 6);

    image1.rotation += 0.013;
}
