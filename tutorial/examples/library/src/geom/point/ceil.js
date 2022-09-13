var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var point1;
var point2;
var text1;
var text2;
var graphics;
var y = 100;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0x2266aa } });

    point1 = new Phaser.Geom.Point(300, 100);
    point2 = new Phaser.Geom.Point(500, 100);

    text1 = this.add.text(100, 50, '');
    text2 = this.add.text(500, 50, '');
}

function update ()
{
    y += 0.05;

    point1.y = point2.y = y;

    Phaser.Geom.Point.Ceil(point2);

    text1.setText('y: ' + point1.y);
    text2.setText('y: ' + point2.y);

    graphics.clear();
    graphics.fillPointShape(point1, 20);
    graphics.fillPointShape(point2, 20);
}
