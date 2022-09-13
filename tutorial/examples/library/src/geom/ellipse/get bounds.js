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

var ellipse;
var bounds;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa }, fillStyle: { color: 0x00aaaa }});

    ellipse = new Phaser.Geom.Ellipse(400, 300, 250, 150);

    // if we omit the out parameter, we get a new Rectangle instance
    bounds = Phaser.Geom.Ellipse.GetBounds(ellipse);
}

function update ()
{
    a += 0.01;

    if (a > Math.PI * 4)
    {
        a -= Math.PI * 4;
    }

    ellipse.x = 400 - Math.cos(a / 2) * 300;
    ellipse.y = 300 - Math.sin(a * 2) * 200;
    ellipse.width = Math.sin(a) * Math.sin(a) * 300;
    ellipse.height = Math.cos(a) * Math.sin(a) * 300;

    // or we can supply a Rectangle instance to modify
    Phaser.Geom.Ellipse.GetBounds(ellipse, bounds);

    graphics.clear();

    graphics.fillEllipseShape(ellipse);

    graphics.strokeRectShape(bounds);
}
