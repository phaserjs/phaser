var config = {
    type: Phaser.CANVAS,
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

var image;
var iter = 0;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create ()
{
    image = this.add.image(400, 300, 'einstein');
    setTimeout(function loopX() {
        image.flipX = !image.flipX;
        setTimeout(loopX, 1000);
    }, 1000);

    setTimeout(function loopY() {
        image.flipY = !image.flipY;
        setTimeout(loopY, 2000);
    }, 2000);
}

function update ()
{
    image.scaleX = Math.sin(iter);
    image.scaleY = Math.cos(iter);
    image.rotation = iter;
    image.x = 400 + Math.sin(iter * 10) * 200;
    iter += 0.001;
}