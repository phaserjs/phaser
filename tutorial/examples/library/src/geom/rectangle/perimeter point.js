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
var rect;
var point;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    rect = new Phaser.Geom.Rectangle(32, 32, 256, 256);
    point = new Phaser.Geom.Rectangle(0, 0, 8, 8);
}

function update ()
{
    a++;

    Phaser.Geom.Rectangle.PerimeterPoint(rect, a, point);

    graphics.clear();

    graphics.strokeRectShape(rect);

    graphics.fillRect(point.x - 4, point.y - 4, point.width, point.height);

    //  Draw a line from the center of the rect to the point on the perimeter

    graphics.lineStyle(2, 0xffffff);
    graphics.beginPath();
    graphics.moveTo(rect.centerX, rect.centerY);
    graphics.lineTo(point.x, point.y);
    graphics.closePath();
    graphics.strokePath();
}
