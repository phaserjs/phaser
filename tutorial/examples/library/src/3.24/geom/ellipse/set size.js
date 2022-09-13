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
    var ellipse = new Phaser.Geom.Ellipse(400, 300);

    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa } });

    for(var i = 0; i < 26; i++)
    {
        ellipse.setSize(i * 32, i * 24);

        // stroke with increasing smoothness
        graphics.strokeEllipseShape(ellipse, 32 + i);
    }
}
