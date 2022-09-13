var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image0;
var image1;
var tween;
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('image0', 'assets/pics/ra-einstein.png');
    this.load.image('image1', 'assets/sprites/mushroom2.png');
}

function create ()
{
    image0 = this.add.tileSprite(400, 300, 800, 600, 'image0');
    image1 = this.add.tileSprite(400, 300, 250, 250, 'image1');

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
    image0.tilePositionX = Math.cos(iter) * 700;
    image0.tilePositionY = Math.sin(iter) * 500;

    image0.tileScaleX = tween.getValue();
    image0.tileScaleY = tween.getValue();

    image1.tilePositionX = Math.cos(-iter) * 400;
    image1.tilePositionY = Math.sin(-iter) * 400;

    iter += 0.01;
}