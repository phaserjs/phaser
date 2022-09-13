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

    var parent = new Phaser.Structs.Size(400, 300);
    var child = new Phaser.Structs.Size(300, 200, Phaser.Structs.Size.WIDTH_CONTROLS_HEIGHT, parent);

    var draw = function ()
    {
        debug.clear().translateCanvas(10, 10);
        debug.lineStyle(1.5, 0xffff00).strokeRect(1, 1, parent.width, parent.height);
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
