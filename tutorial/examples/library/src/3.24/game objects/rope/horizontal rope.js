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
        this.load.image('bg', 'assets/rope/background-red.png');
        this.load.image('banner', 'assets/rope/fade-one.png');
    }

    create ()
    {
        this.add.image(512, 300, 'bg');

        //  This creates a Rope Game Object.
        //  The value 20 instructs the Rope to split itself into 20 segments.
        //  The rope will be split horizontally, with the vertices arranged in a horizontal strip.

        //  The minimum number of segments you can have are 1, which is the same as a quad.
        //  The rope will use the defined texture to determine its width. The texture will not
        //  repeat should the Rope be shorter / longer, it will instead stretch (or shrink)
        this.rope = this.add.rope(400, 300, 'banner', null, 20);
    }

    update ()
    {
        this.count += 0.1;

        let points = this.rope.points;

        for (let i = 0; i < points.length; i++)
        {
            points[i].y = Math.sin(i * 0.5 + this.count) * 16;
        }

        this.rope.setDirty();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
