
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { create: create, update: update });

var p;

var distance = 300;
var speed = 6;

var max = 20000;
var xx = [];
var yy = [];
var zz = [];

function create() {

    p = this.add.pixelField(0, 0, 2);

    for (var i = 0; i < max; i++)
    {
        xx[i] = Math.floor(Math.random() * 800) - 400;
        yy[i] = Math.floor(Math.random() * 600) - 300;
        zz[i] = Math.floor(Math.random() * 1700) - 100;

        var perspective = distance / (distance - zz[i]);
        var x = 400 + xx[i] * perspective;
        var y = 300 + yy[i] * perspective;

        p.add(x, y, 255, 255, 255, 1);
    }

}

function update() {

    for (var i = 0; i < max; i++)
    {
        var perspective = distance / (distance - zz[i]);
        var x = 400 + xx[i] * perspective;
        var y = 300 + yy[i] * perspective;

        zz[i] += speed;

        if (zz[i] > 300)
        {
            zz[i] -= 600;
        }

        p.list[i].x = x;
        p.list[i].y = y;
    }

}