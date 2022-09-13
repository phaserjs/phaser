class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.hsl;
        this.count = 0;
        this.colorCount = 0;
        this.ropes = [];
    }

    preload ()
    {
        this.load.image('bg', 'assets/rope/background-geo-grey.jpg');
        this.load.image('glassblock', 'assets/rope/glassblock.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        const hsl = Phaser.Display.Color.HSVColorWheel();

        const rope1 = this.add.rope(400, 150, 'glassblock', null, 32);
        
        //  Here we'll modify the Rope.colors array to use the HSV color values:

        for (let i = 0; i < rope1.colors.length; i++)
        {
            rope1.colors[i] = hsl[Math.floor(hsl.length / rope1.colors.length) * i].color;
        }

        const rope2 = this.add.rope(400, 300, 'glassblock', null, 32);
        
        //  In this Rope, each vertex will have a random color from the HSV color wheel:

        for (let i = 0; i < rope2.colors.length; i++)
        {
            rope2.colors[i] = Phaser.Utils.Array.GetRandom(hsl).color;
        }

        const rope3 = this.add.rope(400, 450, 'glassblock', null, 32);
        
        //  This Rope is updated in the `update` method, to cycle the color values through it:

        for (let i = 0; i < rope3.colors.length; i++)
        {
            rope3.colors[i] = hsl[i].color;
        }

        this.ropes.push(rope1, rope2, rope3);

        this.hsl = hsl;
    }

    update ()
    {
        this.count += 0.1;
        this.colorCount++;

        //  Color cycle rope3
        const rope3 = this.ropes[2];

        for (let i = 0; i < rope3.colors.length; i++)
        {
            let colorIndex = Phaser.Math.Wrap(this.colorCount + i, 0, this.hsl.length);

            rope3.colors[i] = this.hsl[colorIndex].color;
        }

        this.ropes.forEach((rope) => {

            let points = rope.points;

            for (let i = 0; i < points.length; i++)
            {
                points[i].y = Math.sin(i * 0.15 + this.count) * 24;
            }
    
            rope.setDirty();
    
        });
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
