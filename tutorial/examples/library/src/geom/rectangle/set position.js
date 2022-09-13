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
    var rect = new Phaser.Geom.Rectangle(0, 0, 160, 120);

    rect.setPosition(240, 180);

    var graphics = this.add.graphics({ lineStyle: { color: 0xff0000 } });
    graphics.strokeRectShape(rect);

    // move right by width
    rect.x += rect.width;

    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRectShape(rect);

    // move down by height
    rect.y += rect.height;

    graphics.lineStyle(1, 0x0000ff);
    graphics.strokeRectShape(rect);
}
