var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sparkle', 'assets/particles/sparkle1.png');
}

function create ()
{
    var points = [
        50, 300, 179, 449, 394, 498, 593, 455,
        701, 338, 692, 190, 603, 76, 423, 41,
        272, 78, 181, 186, 230, 328, 416, 395,
        565, 327, 550, 202, 467, 149, 355, 164,
        343, 254, 428, 303
    ];

    var curve = new Phaser.Curves.Spline(points);

    for (var i = 0; i < 20; i++)
    {
        var follower = this.add.follower(curve, 100, 100 + (30 * i), 'sparkle');

        follower.setBlendMode(Phaser.BlendModes.ADD);

        follower.startFollow({
            duration: 4500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            _delay: i * 200,
            delay: i * 100
        });
    }
}
