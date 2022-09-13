var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: 0x2d2d2d,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var back;
var bob;
var graphics;
var offset;
var tween;
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom-32x32.png');
}

function create ()
{
    back = this.add.tileSprite(400, 300, 32*18, 32*12, 'mushroom').setAlpha(0.2);

    bob = this.add.tileSprite(400, 300, 32*18, 32*12, 'mushroom');

    graphics = this.add.graphics();

    var cropWidth = 200;
    var cropHeight = 100;

    bob.setCrop(0, 0, cropWidth, cropHeight);

    offset = bob.getTopLeft();

    this.input.on('pointermove', function (pointer) {

        bob.setCrop(
            (pointer.x - offset.x) - cropWidth / 2,
            (pointer.y - offset.y) - cropHeight / 2,
            cropWidth,
            cropHeight
        );
    });

    tween = this.tweens.addCounter({
        from: 1,
        to: 2,
        duration: 5000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    graphics.clear();
    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRect(offset.x + bob._crop.x, offset.y + bob._crop.y, bob._crop.width, bob._crop.height);

    back.tilePositionX = Math.cos(iter) * 700;
    back.tilePositionY = Math.sin(iter) * 500;
    back.tileScaleX = tween.getValue();
    back.tileScaleY = tween.getValue();

    bob.tilePositionX = Math.cos(iter) * 700;
    bob.tilePositionY = Math.sin(iter) * 500;
    bob.tileScaleX = tween.getValue();
    bob.tileScaleY = tween.getValue();

    iter += 0.001;
}
