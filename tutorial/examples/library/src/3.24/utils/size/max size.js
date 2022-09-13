var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var debug = this.add.graphics();
    var text = this.add.text(10, 540, '', { fill: '#00ff00' });

    var child = new Phaser.Structs.Size(420, 340, Phaser.Structs.Size.NONE);

    child.setMax(640, 480);

    var draw = function ()
    {
        debug.clear().translateCanvas(10, 10);
        debug.fillStyle(0x00ff00, 0.5).fillRect(1, 1, child.width, child.height);

        text.setText([
            'width: ' + child.width,
            'height: ' + child.height,
            'aspect ratio: ' + child.aspectRatio
        ]);
    };

    this.input.on('pointermove', function (pointer) {

        child.setSize(pointer.x, pointer.y);

        draw();

    });

    draw();
}
