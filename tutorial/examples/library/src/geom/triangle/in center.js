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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xffff00 } });

    //  Create a random triangle

    var x1 = Phaser.Math.Between(100, 700);
    var y1 = Phaser.Math.Between(50, 550);

    var x2 = Phaser.Math.Between(100, 700);
    var y2 = Phaser.Math.Between(50, 550);

    var x3 = Phaser.Math.Between(100, 700);
    var y3 = Phaser.Math.Between(50, 550);

    var triangle = new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3);

    graphics.strokeTriangleShape(triangle);

    //  Get the inCenter of the triangle

    var incenter = Phaser.Geom.Triangle.InCenter(triangle);

    //  Draw lines from each point of the triangle to the center

    graphics.lineStyle(1, 0x00ff00);

    graphics.lineBetween(x1, y1, incenter.x, incenter.y);
    graphics.lineBetween(x2, y2, incenter.x, incenter.y);
    graphics.lineBetween(x3, y3, incenter.x, incenter.y);

    //  Draw the center

    graphics.fillPointShape(incenter, 4);
}
