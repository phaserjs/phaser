var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/50x50.png');
    this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
    var c = 0;
    var blocks = [];

    for (var i = 0; i < 108; i++)
    {
        var block = this.add.image(0, 0, 'block').setScale(0.3);

        blocks.push(block);

        this.tweens.add({
            targets: block,
            scaleX: 1,
            scaleY: 1,
            ease: 'Sine.easeInOut',
            duration: 300,
            delay: c * 50,
            repeat: -1,
            yoyo: true
        });

        c++;

        if (c % 12 === 0)
        {
            c = 0;
        }
    }

    Phaser.Actions.GridAlign(blocks, {
        width: 12,
        height: 10,
        cellWidth: 60,
        cellHeight: 60,
        x: 70,
        y: 60
    });

    var image1 = this.add.image(0, 80, 'fish', 0);

    this.tweens.add({
        targets: image1,
        props: {
            x: { value: 700, duration: 4000, flipX: true },
            y: { value: 500, duration: 8000,  },
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    var image2 = this.add.image(400, 80, 'fish', 1);

    this.tweens.add({
        targets: image2,
        props: {
            x: { value: 500, duration: 2000, flipX: true },
            y: { value: 500, duration: 10000,  },
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    var image3 = this.add.image(800, 200, 'fish', 2).setFlipX(true);

    this.tweens.add({
        targets: image3,
        props: {
            x: { value: 70, flipX: true },
            y: { value: 250 },
        },
        duration: 3000,
        ease: 'Power1',
        yoyo: true,
        repeat: -1
    });

    var image4 = this.add.image(100, 550, 'fish', 2).setScale(0.75);

    this.tweens.add({
        targets: image4,
        props: {
            x: { value: 700, duration: 2000, flipX: true },
            y: { value: 50, duration: 15000,  },
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    this.input.once('pointerdown', () => {

        this.tweens.killTweensOf([ image1, blocks, image4 ]);

    });
}
