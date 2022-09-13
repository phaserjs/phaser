
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { create: create, update: update });

function between (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var p;
var data = { res: 4, pow: 10000, angle: 0.1, height: 6 };

function create() {

    var hsv = Phaser.Color.HSVColorWheel();

    p = this.add.pixelField(0, 0, 2);

    for (var x = -100; x <= 100; x += 2)
    {
        var v = data.res * Math.floor(Math.sqrt((data.pow) - x * x) / data.res);

        for (var y = v; y > -v; y -= data.res)
        {
            var z = (32 * Math.sin(Math.sqrt(x * x + y * y) / data.height)) + data.angle * y;

            var drawX = 400 + Math.floor(x * 3);
            var drawY = 300 + Math.floor(z * 2);

            p.add(drawX, drawY, 255, 255, 0, 1);
        }
    }

    console.log(p.list.length);

    this.add.tween(data).to( { height: 12 }, 3000, "Sine.easeInOut", true, 4000, -1, true);
    this.add.tween(data).to( { angle: 1.0 }, 4000, "Linear", true, 0, -1, true);

}

function plot() {

    var i = 0;

    for (var x = -100; x <= 100; x += 2)
    {
        var v = data.res * Math.floor(Math.sqrt((data.pow) - x * x) / data.res);

        for (var y = v; y > -v; y -= data.res)
        {
            var z = (32 * Math.sin(Math.sqrt(x * x + y * y) / data.height)) + data.angle * y;

            p.list[i].x = 400 + Math.floor(x * 3);
            p.list[i].y = 300 + Math.floor(z * 2);

            i++;
        }
    }

}

function update() {

    plot();

}