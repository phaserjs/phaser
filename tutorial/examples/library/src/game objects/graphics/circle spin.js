var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    }
};

var time = 0;
var inc = 0;
var graphics;
var palette;

var game = new Phaser.Game(config);

// https://twitter.com/lexaloffle/status/1003303393572425731

function create ()
{
    graphics = this.add.graphics({ x: 400, y: 300 });

    palette = [ 0, 1911635, 8267091, 34641, 11227702, 6248271, 12764103, 16773608, 16711757, 16753408, 16772135, 58422, 2731519, 8615580, 16742312, 16764074 ];
}

function cos (f)
{
    return Math.cos(f * (Math.PI * 2));
}

function sin (f)
{
    return Math.sin(f * (Math.PI * 2));
}

function update ()
{
    time += 0.03;

    time = Phaser.Math.Wrap(time, -32765, 32765);

    graphics.clear();

    var f = time / 9;
    var n = 650 + 60 * sin(f / 3);

    for (var i = 1; i < n; i++)
    {
        var a = f + Math.random();
        var d = 0.3 + Math.random() * 2;
        var y = -2;

        if (i > 400)
        {
            var j = i - 400;
            y = j * 2 / n - 1;
            a = j * 40 / n + f + j / 3;
            d = j * 3 / n
        }

        var x = d * cos(a);
        var z = 2 + cos(f) + d * sin(a);

        x = 64 + x * 64 / z;
        y = 64 + y * 64 / z;

        var c = 6 + i % 5;
        var e = 5 / z;

        if (z > 0.1)
        {
            graphics.fillStyle(palette[c]);

            if (i > 400)
            {
                graphics.fillCircle(x, y, e);
            }
            else
            {
                graphics.fillRect(x, y, e, e);
            }

            // graphics.fillStyle(palette[c / 4]);
            // graphics.fillCircle(x, 128 - y, e);
        }

    }

}
