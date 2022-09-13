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
    var rect = new Phaser.Geom.Rectangle();

    var graphics = this.add.graphics({ lineStyle: { color: 0x0000ff } });

    for(var i = 0; i < 34; i++)
    {
        rect.setSize(i * 24, i * 18);

        graphics.strokeRectShape(rect);
    }
}
