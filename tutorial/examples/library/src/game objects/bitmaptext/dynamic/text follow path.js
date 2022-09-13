let t = 0;
let path;

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    }

    create ()
    {
        path = new Phaser.Curves.Path(1500, 500);

        path.lineTo(700, 500);
        path.splineTo([ 745, 256, 550, 145, 300, 250, 260, 450, 50, 500 ]);
        path.lineTo(-100, 500);

        const text = this.add.dynamicBitmapText(0, 0, 'desyrel', 'Phaser 3', 64);

        text.setDisplayCallback(this.positionOnPath);

        const graphics = this.add.graphics();

        graphics.lineStyle(1, 0xffffff, 1);

        path.draw(graphics, 128);
    }

    update()
    {
        t += 0.001;

        if (t >= (1 - 0.24))
        {
            t = 0;
        }
    }

    //  data = { color: color, index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY }
    positionOnPath (data)
    {
        var pathVector = path.getPoint(t + ((6 - data.index) * 0.04));

        if (pathVector)
        {
            data.x = pathVector.x;
            data.y = pathVector.y;
        }

        return data;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};


const game = new Phaser.Game(config);
