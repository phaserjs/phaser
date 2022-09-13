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

    this.input.on('pointermove', function (pointer) {
    
        ellipse.width = Math.abs(pointer.x - ellipse.x) * 2;
        ellipse.height = Math.abs(pointer.y - ellipse.y) * 2;

        graphics.clear();
        graphics.strokeEllipseShape(ellipse, 64);
    
    });
}
