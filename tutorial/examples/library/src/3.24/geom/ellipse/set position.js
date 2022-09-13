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
    var ellipse = new Phaser.Geom.Ellipse(0, 0, 200, 120);

    ellipse.setPosition(300, 200);

    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
    graphics.strokeEllipseShape(ellipse);

    // move right by width
    ellipse.x += ellipse.width;

    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeEllipseShape(ellipse);

    // place top-right corner to bottom-left of its previous position
    ellipse.right = ellipse.left;
    ellipse.top = ellipse.bottom;

    graphics.lineStyle(2, 0x0000ff);
    graphics.strokeEllipseShape(ellipse);
}
