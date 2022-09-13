class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.rope;
        this.count = 0;
    }

    preload ()
    {
        this.load.image('bg', 'assets/rope/background-grave.png');
        this.load.spritesheet('skeleton', 'assets/rope/skeleton.png', { frameWidth: 1580 / 2, frameHeight: 932 / 2 });
    }

    create ()
    {
        this.bg = this.add.tileSprite(400, 100, 2000, 1143, 'bg');

        this.anims.create({
            key: 'skeletonRun',
            repeat: -1,
            frameRate: 10,
            frames: this.anims.generateFrameNumbers('skeleton', { start: 0, end: 7 }),
        });

        //  Ropes support animations in the same way that Sprites do.
        //  There are some limitations - the main one being that they do not support custom offsets.
        //  But on the whole, you can animation a Rope just like you would a Sprite, for some neat effects.
        this.rope = this.add.rope(400, 350, 'skeleton', 0, 12, false);

        this.rope.play('skeletonRun');
    }

    update ()
    {
        this.bg.tilePositionX += 2;

        this.count += 0.1;

        let points = this.rope.points;

        for (let i = 0; i < points.length; i++)
        {
            if (this.rope.horizontal)
            {
                points[i].y = Math.sin(i * 0.5 + this.count) * 10;
            }
            else
            {
                points[i].x = Math.sin(i * 0.5 + this.count) * 12;
            }
        }

        this.rope.setDirty();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d002d',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
