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
        this.load.image('bg', 'assets/rope/background-neon.png');
        this.load.image('snake', 'assets/rope/batman-logo.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        this.rope = this.add.rope(400, 300, 'snake', null, 64);

        //  By providing 2 values to the `setAlphas` function
        //  we can set the alpha across the whole Rope from top to bottom:
        this.rope.setAlphas(1, 0.3);
    }

    update ()
    {
        this.count += 0.1;

        let points = this.rope.points;

        for (let i = 0; i < points.length; i++)
        {
            points[i].y = Math.sin(i * 0.15 + this.count) * 20;
        }

        this.rope.setDirty();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000088',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
