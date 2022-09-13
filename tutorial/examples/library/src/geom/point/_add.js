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
    var graphics = this.add.graphics({ fillStyle: { color: 0x2266aa } });

    var point = new Phaser.Geom.Point(0, 300);

    for(var angle = 0; point.x < 800; angle += Math.PI / 18) {

        graphics.fillPointShape(point, 20);

        Phaser.Geom.Point.Add(point, 20, Math.cos(angle) * 40);
    }
}
