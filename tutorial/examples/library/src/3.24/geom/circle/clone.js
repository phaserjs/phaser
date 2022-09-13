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

var graphics;
var circles;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { color: 0x00ff00 } });

    var circle = new Phaser.Geom.Circle(400, 300, 0);

    circles = [circle];

    for(var i = 0; i < 80; i++)
    {
        circle = Phaser.Geom.Circle.Clone(circle);
        circle.radius += 1;

        Phaser.Geom.Circle.CircumferencePoint(circle, i / 20 * Phaser.Math.PI2, circle);

        circles.push(circle);
    }
}

function update ()
{
    graphics.clear();

    for(var i = 0; i < circles.length; i++)
    {
        circles[i].radius += 1;
        if(circles[i].radius > 800)
        {
            circles[i].radius = 0;
        }

        graphics.strokeCircleShape(circles[i]);
    }
}