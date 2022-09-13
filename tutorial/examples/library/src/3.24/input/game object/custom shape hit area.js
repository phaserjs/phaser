var config = {
    type: Phaser.AUTO,
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
    this.load.image('ball', 'assets/sprites/spikedball.png');
}

function create ()
{
    var shape = new Phaser.Geom.Circle(48, 48, 48);

    var ball1 = this.add.image(200, 300, 'ball').setInteractive(shape, handler);
    var ball2 = this.add.image(400, 300, 'ball').setInteractive(shape, handler);
    var ball3 = this.add.image(600, 300, 'ball').setInteractive(shape, handler);

    ball1.on('pointerdown', function () {
        this.setTint(Math.random() * 16000000);
    });

    ball2.on('pointerdown', function () {
        this.setTint(Math.random() * 16000000);
    });

    ball3.on('pointerdown', function () {
        this.setTint(Math.random() * 16000000);
    });
}

function handler (shape, x, y, gameObject)
{
    if (shape.radius > 0 && x >= shape.left && x <= shape.right && y >= shape.top && y <= shape.bottom)
    {
        var dx = (shape.x - x) * (shape.x - x);
        var dy = (shape.y - y) * (shape.y - y);

        return (dx + dy) <= (shape.radius * shape.radius);
    }
    else
    {
        return false;
    }
}
