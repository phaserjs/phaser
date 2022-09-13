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
var ellipses;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { color: 0x00aaaa }, fillStyle: { color: 0x00aaaa }});

    ellipses = [];

    for(var y = 0; y < 5; y++)
    {
        for(var x = 0; x < 5; x++)
        {
            var relativeSize = Math.random() * 2 - 1;

            var ellipse = new Phaser.Geom.Ellipse(80 + x * 160, 60 + y * 120, relativeSize * 160, relativeSize * 120);

            ellipses.push(ellipse);
        }
    }
}

function update ()
{
    graphics.clear();

    for(var i = 0; i < ellipses.length; i++)
    {
        var ellipse = ellipses[i];

        ellipse.width += 0.8;
        ellipse.height += 0.6;

        if(ellipse.width >= 160 || ellipse.height >= 120)
        {
            ellipse.setSize(-160, -120);
        }

        if(!ellipse.isEmpty())
        {
            graphics.fillEllipseShape(ellipse);
        }
        else
        {
            graphics.strokeEllipseShape(ellipse);
        }
    }
}
