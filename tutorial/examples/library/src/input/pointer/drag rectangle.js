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
    var graphics = this.add.graphics();

    var color = 0xffff00;
    var thickness = 2;
    var alpha = 1;

    //  Events

    var draw = false;

    this.input.on('pointerdown', function (pointer) {

        draw = true;

    });

    this.input.on('pointerup', function () {

        draw = false;

    });

    this.input.on('pointermove', function (pointer) {

        if (draw)
        {
            graphics.clear();
            graphics.lineStyle(thickness, color, alpha);
            graphics.strokeRect(pointer.downX, pointer.downY, pointer.x - pointer.downX, pointer.y - pointer.downY);
        }

    });
}
