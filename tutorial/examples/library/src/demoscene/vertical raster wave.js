var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('raster', 'assets/phaser3/bars.png', { frameWidth: 46, frameHeight: 2 });
}

function create ()
{
    var group = this.add.group();

    var x = 200;
    var y = 0;
    var frame = 0;

    for (var i = 0; i < 180; i++)
    {
        var bar = group.create(x, y, 'raster', frame);

        bar.setOrigin(0);

        bar.displayHeight = 600 - y;

        y += 3;

        frame++;

        if (frame === 9)
        {
            frame = 0;
        }
    }

    this.tweens.add({
        targets: group.getChildren(),
        x: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        duration: 1500,
        delay: function (target, key, value, targetIndex) {
            return targetIndex * 30;
        }
    });
}
