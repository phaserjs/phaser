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

var points = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/tests/sw.png');
}

function create ()
{
    this.add.image(0, 0, 'pic').setOrigin(0).setAlpha(0.8);

    var sketch = this.add.graphics();

    sketch.lineStyle(2, 0x00ff00);

    //  The graphics instance you draw on

    var graphics = this.add.graphics();

    var line = new Phaser.Geom.Line();

    this.input.on('pointerdown', function (pointer) {

        line.setTo(pointer.x, pointer.y, pointer.x, pointer.y);

    });

    this.input.on('pointerup', function (pointer) {

        sketch.strokeLineShape(line);

        graphics.clear();

    });

    this.input.on('pointermove', function (pointer) {

        if (!pointer.isDown)
        {
            return;
        }

        line.x2 = pointer.x;
        line.y2 = pointer.y;

        graphics.clear();

        graphics.lineStyle(2, 0x00ff00);

        graphics.strokeLineShape(line);

    });

}