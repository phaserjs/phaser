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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });

    //  Create a little random triangle

    var x1 = Phaser.Math.Between(300, 350);
    var y1 = Phaser.Math.Between(300, 350);

    var x2 = Phaser.Math.Between(400, 450);
    var y2 = Phaser.Math.Between(200, 300);

    var x3 = Phaser.Math.Between(500, 550);
    var y3 = Phaser.Math.Between(300, 350);

    var triangle = new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3);

    graphics.fillTriangleShape(triangle);

    //  Get the circumcircle of the triangle

    var circumcircle = Phaser.Geom.Triangle.CircumCircle(triangle);

    //  Draw the circumcircle

    graphics.strokeCircleShape(circumcircle);

    //  Get the circumcenter of the triangle

    var circumcenter = Phaser.Geom.Triangle.CircumCenter(triangle);

    //  Draw the circumcenter

    graphics.fillStyle(0xffff00);
    graphics.fillPointShape(circumcenter, 4);
}
