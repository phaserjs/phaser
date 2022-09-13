var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
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
    this.load.image('brush', 'assets/sprites/brush1.png');
    this.load.image('pic', 'assets/pics/brilliance-jim-sachs.png');
}

function create ()
{
    var rt = this.add.renderTexture(0, 0, 800, 600);

    var mask = rt.createBitmapMask();

    var pic = this.add.image(400, 300, 'pic');

    pic.setMask(mask);

    this.input.on('pointermove', function (pointer) {

        if (pointer.isDown)
        {
            rt.draw('brush', pointer.x - 32, pointer.y - 32);
        }

    }, this);

    this.input.keyboard.on('keydown-SPACE', function (event) {

        rt.resize(400, 300);

    });
}
