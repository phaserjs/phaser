var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('car', 'assets/pics/supercars-parsec.png');
}

function create ()
{
    var sprite = this.add.sprite(400, 300, 'car');

    var shape = new Phaser.Geom.Polygon([
        0, 143,
        0, 92,
        110, 40,
        244, 4,
        330, 0,
        458, 12,
        574, 18,
        600, 79,
        594, 153,
        332, 152,
        107, 157
    ]);

    sprite.setInteractive(shape, Phaser.Geom.Polygon.Contains);

    //  Input Event listeners

    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0x7878ff);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });

    //  Draw the polygon
    var graphics = this.add.graphics({ x: sprite.x - sprite.displayOriginX, y: sprite.y - sprite.displayOriginY });

    graphics.lineStyle(2, 0x00aa00);

    graphics.beginPath();

    graphics.moveTo(shape.points[0].x, shape.points[0].y);

    for (var i = 1; i < shape.points.length; i++)
    {
        graphics.lineTo(shape.points[i].x, shape.points[i].y);
    }

    graphics.closePath();
    graphics.strokePath();
}
