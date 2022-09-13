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

    var point1 = new Phaser.Geom.Point();// point at 0/0
    var point2 = new Phaser.Geom.Point(100);// point at 100/100
    var point3 = new Phaser.Geom.Point(400, 300);// point at 400/300

    graphics.fillPointShape(point1, 15);
    graphics.fillPointShape(point2, 15);
    graphics.fillPointShape(point3, 15);
}
