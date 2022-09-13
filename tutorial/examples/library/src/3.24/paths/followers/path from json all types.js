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
    this.load.json('all', 'assets/paths/types-test.json');
    this.load.image('ship', 'assets/sprites/bsquadron2.png');
}

function create ()
{
    var path = new Phaser.Curves.Path(this.cache.json.get('all'));

    var graphics = this.add.graphics().lineStyle(1, 0x2d2d2d, 1);

    path.draw(graphics);

    for (var i = 0; i < 20; i++)
    {
        var follower = this.add.follower(path, 0, 0, 'ship');

        follower.startFollow({
            duration: 8000,
            positionOnPath: true,
            repeat: -1,
            yoyo: true,
            ease: 'Linear',
            delay: i * 70
        });
    }
}
