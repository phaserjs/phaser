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
    this.load.image('raster', 'assets/demoscene/raster-bw-800x16.png');
}

function create ()
{
    var group = this.add.group();

    group.createMultiple({ key: 'raster', repeat: 64 });

    var hsv = Phaser.Display.Color.HSVColorWheel();

    var i = 0;

    var _this = this;

    group.children.iterate(function (child) {

        child.x = 400;
        child.y = 100;
        child.depth = 64 - i;

        child.setTint(hsv[i * 4].color);

        i++;

        _this.tweens.add({
            targets: child,
            props: {
                y: { value: 500, duration: 1500 },
                scaleX: { value: child.depth / 64, duration: 6000, hold: 2000, delay: 2000 }
            },
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 32 * i
        });

    });
}
