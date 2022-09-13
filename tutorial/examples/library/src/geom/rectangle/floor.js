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

var rect1;
var rect2;
var graphics;
var y = 0;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0x0000aa } });

    rect1 = new Phaser.Geom.Rectangle(100, 0, 250, 100);
    rect2 = new Phaser.Geom.Rectangle(450, 0, 250, 100);
}

function update ()
{
    y += 0.05;

    rect1.y = rect2.y = y;

    Phaser.Geom.Rectangle.Floor(rect2);

    graphics.clear();
    graphics.fillRectShape(rect1);
    graphics.fillRectShape(rect2);
}
