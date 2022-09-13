var config = {
    type: Phaser.CANVAS,
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
    this.load.image('grid', 'assets/pics/debug-grid-1920x1920.png');
    this.load.image('arrow', 'assets/sprites/arrow.png');
}

function create ()
{
    //  Angle uses degrees instead of radians

    for (var a = 0; a <= 360; a += 45)
    {
        var frame = this.add.image(40 + a * 2, 300, 'arrow').setAngle(a);

        //  You can also do: frame.angle = degrees;
    }
}
