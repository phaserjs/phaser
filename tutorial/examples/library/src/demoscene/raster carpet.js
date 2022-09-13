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
    // this.load.image('raster', 'assets/demoscene/raster-w-800x16.png');
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

        child.x = 500;
        child.y = 100;
        child.depth = 64 - i;
        child.scaleX = 0.6;
        // child.setBlendMode(Phaser.BlendModes.ADD);

        child.setTint(hsv[i * 4].color);

        i++;

        _this.tweens.add({
            targets: child,
            props: {
                x: { value: 300, duration: 700 },
                y: { value: 500, duration: 2500 },
                scaleX: { value: Math.min(0.1, child.depth / 64), duration: 4000, hold: 2000, delay: 2000 }
            },
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 38 * i
        });

    });
}
