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
    var rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);

    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

    graphics.fillRectShape(rect);
}
