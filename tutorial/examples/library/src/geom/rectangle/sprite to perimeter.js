var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var graphics;
var rect;
var point;
var sprite;

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

    sprite = this.add.sprite(500, 100, 'mushroom');

    rect = new Phaser.Geom.Rectangle(350, 300, 200, 128);
    point = new Phaser.Geom.Rectangle(0, 0, 8, 8);

    this.input.on('pointermove', (pointer) => {

        sprite.setPosition(pointer.worldX, pointer.worldY);

    });
}

function update ()
{
    var angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, rect.centerX, rect.centerY);

    Phaser.Geom.Rectangle.PerimeterPoint(rect, Phaser.Math.RadToDeg(angle) + 180, point);

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
