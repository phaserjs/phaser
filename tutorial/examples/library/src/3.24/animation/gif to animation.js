var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var group;

var data = {
    r: -0.05,
    s: -0.0012,
    sx: 0.25,
    x: 400,
    y: 100
};

function preload ()
{
    this.load.setPath('assets/animations/');

    this.load.atlas('sao0');
    this.load.atlas('sao1');
}

function create ()
{
    //  Our animation consists of 50 frames split across 2 texture atlases:

    //  sao0 contains frames: 0, 1, 4, 7, 8, 9, 10, 11, 16, 17, 18, 19, 23, 24, 25, 26, 30, 31, 32, 33, 38, 39, 40, 45, 46, 47, 48
    //  sao1 contains frames: 2, 3, 5, 6, 12, 13, 14, 20, 21, 22, 27, 28, 29, 34, 35, 36, 37, 41, 42, 43, 44, 49, 50

    //  Let's create an array to hold them all:
    var frames = [];

    var sao0 = [ 0, 1, 4, 7, 8, 9, 10, 11, 16, 17, 18, 19, 23, 24, 25, 26, 30, 31, 32, 33, 38, 39, 40, 45, 46, 47, 48 ];
    var sao1 = [ 2, 3, 5, 6, 12, 13, 14, 20, 21, 22, 27, 28, 29, 34, 35, 36, 37, 41, 42, 43, 44, 49, 50 ];

    //  And insert the frames into the array:

    for (var i = 0; i <= 50; i++)
    {
        if (sao0.indexOf(i) > -1)
        {
            frames.push({ key: 'sao0', frame: i.toString() });
        }
        else
        {
            frames.push({ key: 'sao1', frame: i.toString() });
        }
    }

    //  All the 'frames' array needs are objects that contain the key of the texture and the 'frame'
    //  property, which is the name of our frame within the atlas (in this case they're just numbers)

    this.anims.create({
        key: 'swish',
        frames: frames,
        repeat: -1
    });

    group = this.add.group();

    group.createMultiple({ key: 'sao', repeat: 10, setXY: { x: 400, y: 300 }, setAlpha: { value: 0, step: 0.05 } });

    group.playAnimation('swish');

    this.tweens.add({
        targets: data,
        duration: 3000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        props: {
            r: {
                value: 0.05
            },
            s: {
                value: 0.0012
            },
            sx: {
                value: 2.5
            },
            y: {
                value: 400,
                duration: 4000
            }
        }
    });
}

function update ()
{
    var children = group.getChildren();

    Phaser.Actions.Rotate(children, data.r, data.s);
    Phaser.Actions.SetScale(children, data.sx, data.sx, data.s, data.s);
    Phaser.Actions.SetXY(children, data.x, data.y, data.s, data.s);
}
