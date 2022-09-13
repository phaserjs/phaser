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
    var rect = new Phaser.Geom.Rectangle(0, 0, 8, 6);

    var graphics = this.add.graphics({ lineStyle: { color: 0x0000ff } });

    graphics.strokeRectShape(rect);

    for(var i = 0; i < 11; i++)
    {
        rect.setTo(rect.centerX, rect.centerY, rect.width * 1.4, rect.height * 1.4);

        graphics.strokeRectShape(rect);
    }
}
