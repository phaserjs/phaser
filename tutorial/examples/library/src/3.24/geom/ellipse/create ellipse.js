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
    //  Our ellipse is centered at 400x300 and is 600px wide by 300px tall
    var ellipse = new Phaser.Geom.Ellipse(400, 300, 600, 300);

    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });

    graphics.strokeEllipseShape(ellipse, 64);
}
