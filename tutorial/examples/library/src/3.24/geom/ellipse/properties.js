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
    var ellipse = new Phaser.Geom.Ellipse(400, 300, 250, 150);

    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa } });
    graphics.strokeEllipseShape(ellipse);

    graphics.lineStyle(2, 0x00aa00);
    graphics.lineBetween(ellipse.x, ellipse.y, ellipse.right, ellipse.bottom);

    graphics.strokeRect(ellipse.left, ellipse.top, ellipse.width, ellipse.height);
}
