var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
    this.load.image('mask2', 'assets/particles/glass.png');
}

function create ()
{
    var a = this.add.particles('mask2', null, {
        x: 200,
        y: 590,
        angle: { min: 180, max: 360 },
        speed: 200,
        gravityY: -350,
        quantity: 1,
        scale: { min: 0.1, max: 1 }
    });

    var m = this.make.particles({
        key: 'mask2',
        add: true,
        emitters: [
            {
                x: 600,
                y: 590,
                angle: { min: 180, max: 360 },
                speed: 200,
                gravityY: -350,
                scale: { min: 0.1, max: 1 }
            }
        ]
    });
}
