var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

var rectOuter;
var rectInner;
var graphics;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xff00ff }});

    rectOuter = new Phaser.Geom.Rectangle(50, 100, 600, 450);
    rectInner = new Phaser.Geom.Rectangle(250, 200, 300, 200);

    plotRandomPoints();

    this.time.addEvent({ delay: 1000, callback: plotRandomPoints, loop: true });
}

function plotRandomPoints ()
{
    graphics.clear();
    graphics.strokeRectShape(rectOuter);
    graphics.strokeRectShape(rectInner);

    for (var i = 0; i < 400; i++)
    {
        var p = Phaser.Geom.Rectangle.RandomOutside(rectOuter, rectInner);

        graphics.fillRect(p.x, p.y, 2, 2);
    }
}
