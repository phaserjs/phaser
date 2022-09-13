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
    var rect = new Phaser.Geom.Rectangle(250, 200, 250, 200);

    var graphics = this.add.graphics({ fillStyle: { color: 0x0000aa } });
    graphics.fillRectShape(rect);

    graphics.lineStyle(2, 0xaa0000);

    graphics.lineBetween(rect.x, rect.y - 10, rect.x + rect.width, rect.y - 10);

    graphics.lineBetween(rect.x - 10, rect.y, rect.x - 10, rect.y + rect.height);

    graphics.lineBetween(rect.left, rect.top, rect.right, rect.bottom);

    graphics.lineBetween(rect.centerX - 10, rect.centerY, rect.centerX + 10, rect.centerY);
    graphics.lineBetween(rect.centerX, rect.centerY - 10, rect.centerX, rect.centerY + 10);
}
