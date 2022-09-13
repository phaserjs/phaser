var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    var line = new Phaser.Geom.Line();

    this.input.on('pointerdown', function (pointer) {

        line.setTo(pointer.x, pointer.y, pointer.x, pointer.y);

        graphics.clear();
        graphics.lineStyle(4, 0xaa00aa);
        graphics.strokeLineShape(line);

    });

    this.input.on('pointermove', function (pointer) {

        if (pointer.isDown)
        {
            line.x2 = pointer.x;
            line.y2 = pointer.y;
    
            graphics.clear();
            graphics.lineStyle(4, 0xaa00aa);
            graphics.strokeLineShape(line);
        }

    });

    this.input.on('pointerup', function (pointer) {

        Phaser.Geom.Line.RotateAroundPoint(line, line.getPointA(), Math.PI);

        graphics.clear();
        graphics.lineStyle(4, 0x00ff00);
        graphics.strokeLineShape(line);

    });
}
