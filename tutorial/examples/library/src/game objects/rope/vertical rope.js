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
        this.load.image('bg', 'assets/rope/background-meadow.png');
        this.load.image('pikachu', 'assets/rope/pikachu.png');
    }

    create ()
    {
        this.add.image(400, 240, 'bg').setScale(0.8);

        //  This creates a Rope Game Object.
        //  The value 16 instructs the Rope to split itself into 16 segments.
        //  The boolean value 'false' defines the Rope segments as being vertically aligned, rather than horizontally.
        this.rope = this.add.rope(450, 300, 'pikachu', null, 16, false);

        //  You could also call this method instead:
        
        // this.rope.setVertical(16);

        //  However, it will recalculate all of the point, color and alpha data, so if you can set it in the constructor
        //  instead, it makes much more sense.
    }

    update ()
    {
        this.count += 0.1;

        let points = this.rope.points;

        for (let i = 0; i < points.length; i++)
        {
            points[i].x = Math.sin(i * 0.3 + this.count) * 16;
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
