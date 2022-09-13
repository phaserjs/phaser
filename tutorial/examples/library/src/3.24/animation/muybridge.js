var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 952,
    height: 600,
    backgroundColor: '#efefef',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('muybridge', 'assets/animations/muybridge01.png', { frameWidth: 119, frameHeight: 228 });
}

function create ()
{
    var config = {
        key: 'run',
        frames: 'muybridge',
        frameRate: 15,
        repeat: -1
    };

    this.anims.create(config);

    //  Each frame is 119px wide

    group = this.add.group();

    group.createMultiple({
        key: 'muybridge',
        frame: 10,
        repeat: 7,
        setOrigin: { x: 0, y: 0.5 },
        setXY: { x: 0, y: 300, stepX: 119 }
    });

    this.anims.staggerPlay('run', group.getChildren(), -100, false);
}
