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
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000aa } });

    var rect = new Phaser.Geom.Rectangle(400, 300, 1, 1);

    var angle = 0;
    var radius = 1;

    for(var i = 0; i < 73; i++)
    {
        rect.setSize(rect.width + 1);

        var spiralX = 400 + Math.cos(angle) * radius;
        var spiralY = 300 + Math.sin(angle) * radius;

        Phaser.Geom.Rectangle.CenterOn(rect, spiralX, spiralY);

        graphics.fillRectShape(rect);

        radius += 4;
        angle += rect.width / radius;
    }
}