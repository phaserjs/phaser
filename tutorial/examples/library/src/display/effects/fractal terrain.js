var graphics;
var detail = 7;
var size = Math.pow(2, detail) + 1;
var max = size - 1;
var map = new Float32Array(size * size);
var roughness = 0.6;
var width = 0;
var height = 0;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#3d3d89',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics({ x: 400, y: 100 });

    generate();
    draw();
}

function update ()
{
    // draw();
}

function get (x, y)
{
    if (x < 0 || x > max || y < 0 || y > max)
    {
        return -1;
    }

    return map[x + size * y];
}

function set (x, y, val)
{
    map[x + size * y] = val;
}

function generate ()
{
    set(0, 0, max);
    set(max, 0, max / 2);
    set(max, max, 0);
    set(0, max, max / 2);

    divide(max);
}

function divide (size)
{
    var x;
    var y;
    var half = size / 2;
    var scale = roughness * size;

    if (half < 1)
    {
        return;
    }

    for (y = half; y < max; y += size)
    {
        for (x = half; x < max; x += size)
        {
            square(x, y, half, Math.random() * scale * 2 - scale);
        }
    }

    for (y = 0; y <= max; y += half)
    {
        for (x = (y + half) % size; x <= max; x += size)
        {
            diamond(x, y, half, Math.random() * scale * 2 - scale);
        }
    }

    divide(size / 2);
}

function average (values)
{
    var valid = values.filter(function(val) { return val !== -1; });
    var total = valid.reduce(function(sum, val) { return sum + val; }, 0);

    return total / valid.length;
}

function square (x, y, size, offset)
{
    var avg = average([
        get(x - size, y - size),   // upper left
        get(x + size, y - size),   // upper right
        get(x + size, y + size),   // lower right
        get(x - size, y + size)    // lower left
    ]);

    set(x, y, avg + offset);
}

function diamond (x, y, size, offset)
{
    var avg = average([
        get(x, y - size),      // top
        get(x + size, y),      // right
        get(x, y + size),      // bottom
        get(x - size, y)       // left
    ]);

    set(x, y, avg + offset);
}

function draw ()
{
    graphics.clear();

    var waterVal = size * 0.3;

    for (var y = 0; y < size; y++)
    {
        for (var x = 0; x < size; x++)
        {
            var val = get(x, y);
            var top = project(x, y, val);
            var bottom = project(x + 1, y, 0);
            var style = brightness(x, y, get(x + 1, y) - val);

            rect(top, bottom, style);

            // var water = project(x, y, waterVal);
            // rect(water, bottom, 'rgba(50, 150, 200, 0.15)');
        }
    }
}

function rect (a, b, style)
{
    if (b.y < a.y)
    {
        return;
    }

    var rgb = Phaser.Display.Color.RGBStringToColor(style);

    graphics.fillStyle(rgb.color, rgb.alphaGL);
    // graphics.fillRect(a.x * 2, a.y * 2, (b.x - a.x) * 2, (b.y - a.y) * 2);
    // graphics.fillRect(a.x, a.y, (b.x - a.x) * 1, (b.y - a.y) * 1);
    graphics.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
}

function brightness (x, y, slope)
{
    if (y === max || x === max)
    {
        return '#000';
    }

    var b = ~~(slope * 50) + 128;

    return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
}

function iso (x, y)
{
    // return {
    //     x: x,
    //     y: y
    // };
    return {
        x: 0.5 * (size + x - y),
        y: 0.5 * (x + y)
    };
}

function project (flatX, flatY, flatZ)
{
    var point = iso(flatX, flatY);
    var x0 = width * 0.5;
    var y0 = height * 0.2;

    //  Original
    // var z = size * 0.5 - flatZ + point.y * 0.75;
    // var x = (point.x - size * 0.5) * 6;
    // var y = (size - point.y) * 0.005 + 1;

    var z = size * 0.5 - flatZ + point.y * 0.75;
    var x = (point.x - size * 0.5) * 6;
    var y = (size - point.y) * 0.005 + 1;

    return {
        x: x0 + x / y,
        y: y0 + z / y
    };
}
