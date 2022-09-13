var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('font', 'assets/fonts/retro/knighthawks-font-filled.png', { frameWidth: 32, frameHeight: 25 });
}

function create ()
{
    var codeRain = {
        width: 50,
        height: 40,
        cellWidth: 16,
        cellHeight: 16,
        getPoints: function (quantity)
        {
            var cols = (new Array(codeRain.width)).fill(0);
            var lastCol = cols.length - 1;
            var Between = Phaser.Math.Between;
            var RND = Phaser.Math.RND;
            var points = [];

            for (var i = 0; i < quantity; i++)
            {
                var col = Between(0, lastCol);
                var row = (cols[col] += 1);

                if (RND.frac() < 0.01)
                {
                    row *= RND.frac();
                }

                row %= codeRain.height;
                row |= 0;

                points[i] = new Phaser.Math.Vector2(16 * col, 16 * row);
            }

            return points;
        }
    };

    this.add.particles('font').createEmitter({
        alpha: { start: 1, end: 0.25, ease: 'Expo.easeOut' },
        angle: 0,
        blendMode: 'ADD',
        emitZone: { source: codeRain, type: 'edge', quantity: 2000 },
        frame: Phaser.Utils.Array.NumberArray(8, 58),
        frequency: 100,
        lifespan: 6000,
        quantity: 25,
        scale: -0.5,
        tint: 0x0066ff00
    });
}
