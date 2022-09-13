var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    this.load.image('eyes', 'assets/sprites/eyes.png');
    this.load.image('orb', 'assets/particles/green-orb.png');
}

function create ()
{
    var graphics = this.add.graphics();

    var path = new Phaser.Curves.Path(0, 300);

    for (var i = 0; i < 8; i++)
    {
        // xRadius, yRadius, startAngle, endAngle, clockwise, rotation
        if (i % 2 === 0)
        {
            path.ellipseTo(50, 80, 180, 360, true, 0);
        }
        else
        {
            path.ellipseTo(50, 80, 180, 360, false, 0);
        }
    }

    graphics.lineStyle(1, 0xffffff, 1);

    path.draw(graphics);

    for (var i = 0; i < 20; i++)
    {
        if (i === 0)
        {
            var follower = this.add.follower(path, 100, 100 + (30 * i), 'eyes').setDepth(50);
        }
        else
        {
            var follower = this.add.follower(path, 100, 100 + (30 * i), 'orb');
            follower.setBlendMode(Phaser.BlendModes.ADD);
            follower.setScale(0.5);
        }

        follower.startFollow({
            duration: 4000,
            positionOnPath: true,
            repeat: -1,
            ease: 'Linear',
            delay: i * 70
        });
    }
}
