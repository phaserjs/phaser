var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var graphics;

var t = {
    x: -0.03490658503988659,
    y: 0.05235987755982989,
    z: -0.05235987755982989
};

var game = new Phaser.Game(config);

var models = [];
var model;
var i = 0;

//  0 = X, 1 = Y, 2 = Z
var direction = 0;

function preload ()
{
    this.load.text('bevelledcube', 'assets/text/bevelledcube.obj');
    this.load.text('chaosphere', 'assets/text/chaosphere.obj');
    this.load.text('computer', 'assets/text/computer.obj');
    this.load.text('geosphere', 'assets/text/geosphere.obj');
    this.load.text('implodedcube', 'assets/text/implodedcube.obj');
    this.load.text('monobird', 'assets/text/monobird.obj');
    this.load.text('spike', 'assets/text/spike.obj');
    this.load.text('teapot', 'assets/text/teapot.obj');
    this.load.text('torus', 'assets/text/torus.obj');
    // this.load.text('2f', 'assets/text/2faces.obj');
    // this.load.text('2f2', 'assets/text/2facesTriangulated.obj');
}

function create ()
{
    graphics = this.add.graphics();

    // models.push(parseObj(this.cache.text.get('bevelledcube')));
    // models.push(parseObj(this.cache.text.get('chaosphere')));
    // models.push(parseObj(this.cache.text.get('computer')));
    models.push(parseObj(this.cache.text.get('geosphere')));
    // models.push(parseObj(this.cache.text.get('implodedcube')));
    // models.push(parseObj(this.cache.text.get('2f')));
    // models.push(parseObj(this.cache.text.get('monobird')));
    // models.push(parseObj(this.cache.text.get('spike')));
    // models.push(parseObj(this.cache.text.get('teapot')));
    // models.push(parseObj(this.cache.text.get('torus')));

    model = models[0];

    console.log(model);

    this.input.keyboard.on('keyup_X', function () {
        direction = 0;
    });

    this.input.keyboard.on('keyup_Y', function () {
        direction = 1;
    });

    this.input.keyboard.on('keyup_Z', function () {
        direction = 2;
    });

    this.input.keyboard.on('keydown_LEFT', function () {
        rotateX3D(-0.03490658503988659);
    });

    this.input.keyboard.on('keydown_RIGHT', function () {
        rotateX3D(0.03490658503988659);
    });

    this.input.keyboard.on('keydown_UP', function () {

        if (direction === 0)
        {
            rotateY3D(-0.03490658503988659);
        }
        else
        {
            rotateZ3D(-0.03490658503988659);
        }

    });

    this.input.keyboard.on('keydown_DOWN', function () {

        if (direction === 0)
        {
            rotateY3D(0.03490658503988659);
        }
        else
        {
            rotateZ3D(0.03490658503988659);
        }

    });
}

function update ()
{
    draw();
}

function draw ()
{
    var centerX = 400;
    var centerY = 300;
    var scale = 90;

    graphics.clear();

    graphics.lineStyle(2, 0x00ff00, 1.0);

    graphics.beginPath();

    for (var i = 0; i < model.faces.length; i++)
    {
        var face = model.faces[i];

        var v0 = model.verts[face[0] - 1];
        var v1 = model.verts[face[1] - 1];
        var v2 = model.verts[face[2] - 1];
        var v3 = model.verts[face[3] - 1];

        // if (v0 && v1 && v2 && isCcw(v0, v1, v2))
        // {
            drawLine(centerX + v0.x * scale, centerY - v0.y * scale, centerX + v1.x * scale, centerY - v1.y * scale);
            drawLine(centerX + v1.x * scale, centerY - v1.y * scale, centerX + v2.x * scale, centerY - v2.y * scale);
            drawLine(centerX + v2.x * scale, centerY - v2.y * scale, centerX + v3.x * scale, centerY - v3.y * scale);
            drawLine(centerX + v3.x * scale, centerY - v3.y * scale, centerX + v0.x * scale, centerY - v0.y * scale);
        // }
    }

    graphics.closePath();
    graphics.strokePath();
}

function drawLine (x0, y0, x1, y1)
{
    graphics.moveTo(x0, y0);
    graphics.lineTo(x1, y1);
}

// returns true if vertices are in counterclockwise order
function isCcw (v0, v1, v2)
{
    return (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x) >= 0;
}

function rotateX3D (theta)
{
    var ts = Math.sin(theta);
    var tc = Math.cos(theta);

    for (var n = 0; n < model.verts.length; n++)
    {
        var vert = model.verts[n];
        var y = vert.y;
        var z = vert.z;

        vert.y = y * tc - z * ts;
        vert.z = z * tc + y * ts;
    }
}

function rotateY3D (theta)
{
    var ts = Math.sin(theta);
    var tc = Math.cos(theta);

    for (var n = 0; n < model.verts.length; n++)
    {
        var vert = model.verts[n];
        var x = vert.x;
        var z = vert.z;

        vert.x = x * tc - z * ts;
        vert.z = z * tc + x * ts;
    }
}

function rotateZ3D (theta)
{
    var ts = Math.sin(theta);
    var tc = Math.cos(theta);

    for (var n = 0; n < model.verts.length; n++)
    {
        var vert = model.verts[n];
        var x = vert.x;
        var y = vert.y;

        vert.x = x * tc - y * ts;
        vert.y = y * tc + x * ts;
    }
}

// parses an obj file from a text string
function parseObj (text)
{
    var verts = [];
    var faces = [];

    // split the text into lines
    var lines = text.replace('\r', '').split('\n');
    var count = lines.length;

    for (var i = 0; i < count; i++)
    {
        var line = lines[i];

        if (line[0] === 'v')
        {
            // lines that start with 'v' are vertices
            var tokens = line.split(' ');
            verts.push({
                x: parseFloat(tokens[1]),
                y: parseFloat(tokens[2]),
                z: parseFloat(tokens[3])
            });
        }
        else if (line[0] === 'f')
        {
            // lines that start with 'f' are faces
            var tokens = line.split(' ');

            var face = [
                parseInt(tokens[1], 10),
                parseInt(tokens[2], 10),
                parseInt(tokens[3], 10),
                parseInt(tokens[4], 10)
            ];

            faces.push(face);

            if (face[0] < 0)
            {
                face[0] = verts.length + face[0];
            }

            if (face[1] < 0)
            {
                face[1] = verts.length + face[1];
            }

            if (face[2] < 0)
            {
                face[2] = verts.length + face[2];
            }

            if (!face[3])
            {
                face[3] = face[2];
            }
            else if (face[3] < 0)
            {
                face[3] = verts.length + face[3];
            }
        }
    }

    return {
        verts: verts,
        faces: faces
    };
}
