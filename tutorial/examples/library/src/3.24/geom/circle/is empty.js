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
    graphics = this.add.graphics({ lineStyle: { color: 0x00ff00 }, fillStyle: { color: 0x00ff00 }});

    circles = [];

    for(var y = 0; y < 6; y++)
    {
        for(var x = 0; x < 8; x++)
        {
            circles.push(new Phaser.Geom.Circle(50 + x * 100, 50 + y * 100, Phaser.Math.Between(-50, 50)));
        }
    }
}

function update ()
{
    graphics.clear();

    for(var i = 0; i < circles.length; i++)
    {
        var circle = circles[i];

        circle.radius += 0.5;
        if(circle.radius >= 50)
        {
            circle.radius -= 100;
        }

        if(!circle.isEmpty())
        {
            graphics.fillCircleShape(circle);
        }
        else
        {
            graphics.strokeCircleShape(circle);
        }
    }
}