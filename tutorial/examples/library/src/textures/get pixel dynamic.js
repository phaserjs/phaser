var config = {
    type: Phaser.WEBGL,
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
    this.load.image('wheel', 'assets/pics/color-wheel.png');
}

function create ()
{
    //  578 x 550 (289 x 275)
    this.add.image(400, 300, 'wheel');

    var graphics = this.add.graphics( { x: 0, y: 0 });

    var _this = this;

    this.input.on('pointermove', function (pointer) {

        var color = _this.textures.getPixel(pointer.x - 111, pointer.y - 25, 'wheel');

        graphics.clear();

        if (color)
        {
            graphics.lineStyle(1, 0x000000, 1);
            graphics.strokeRect(pointer.x - 1, pointer.y - 1, 34, 34);

            graphics.fillStyle(color.color, 1);
            graphics.fillRect(pointer.x, pointer.y, 32, 32);
        }
    });
}
