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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa } });

    var rect = new Phaser.Geom.Rectangle(0, 290, 20, 20);

    for(var angle = 0; rect.x < 800; angle += Math.PI / 18) {

        graphics.strokeRectShape(rect);

        Phaser.Geom.Rectangle.Offset(rect, 20, Math.cos(angle) * 40);
    }
}
