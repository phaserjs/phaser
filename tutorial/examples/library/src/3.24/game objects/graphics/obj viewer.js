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
    y: 0.03490658503988659,
    z: -0.03490658503988659
};

var game = new Phaser.Game(config);

var models = [];
var model;
var i = 0;

function preload ()
{
    this.load.text('logo', 'assets/text/phaser-logo-3d.obj');
    this.load.text('bevelledcube', 'assets/text/bevelledcube.obj');
    this.load.text('chaosphere', 'assets/text/chaosphere.obj');
    this.load.text('computer', 'assets/text/computer.obj');
    this.load.text('geosphere', 'assets/text/geosphere.obj');
    this.load.text('implodedcube', 'assets/text/implodedcube.obj');
    this.load.text('monobird', 'assets/text/monobird.obj');
    this.load.text('spike', 'assets/text/spike.obj');
    this.load.text('torus', 'assets/text/torus.obj');
}

function create ()
{
    graphics = this.add.graphics(0, 0);

    models.push(parseObj(this.cache.text.get('logo')));
    models.push(parseObj(this.cache.text.get('bevelledcube')));
    models.push(parseObj(this.cache.text.get('chaosphere')));
    models.push(parseObj(this.cache.text.get('computer')));
    models.push(parseObj(this.cache.text.get('geosphere')));
    models.push(parseObj(this.cache.text.get('implodedcube')));
    models.push(parseObj(this.cache.text.get('monobird')));
    models.push(parseObj(this.cache.text.get('spike')));
    models.push(parseObj(this.cache.text.get('torus')));

    model = models[0];

    // console.log(model);

    this.tweens.add({
        targets: t,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true,
        props: {
            x: {
                value: 0.03490658503988659,
                duration: 20000
            },
            y: {
                value: -0.03490658503988659,
                duration: 30000
            },
            z: {
                value: 0.03490658503988659,
                duration: 15000
            }
        }

    });

    this.input.keyboard.on('keydown_SPACE', function () {

        i++;

        if (i === models.length)
        {
            i = 0;
        }

        model = models[i];

    });
}

function update ()
{
    rotateX3D(t.x);
    rotateY3D(t.y);
    rotateZ3D(t.z);

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
        if (v0 && v1 && v2 && v3)
        {
            drawLine(centerX + v0.x * scale, centerY - v0.y * scale, centerX + v1.x * scale, centerY - v1.y * scale);
            drawLine(centerX + v1.x * scale, centerY - v1.y * scale, centerX + v2.x * scale, centerY - v2.y * scale);
            drawLine(centerX + v2.x * scale, centerY - v2.y * scale, centerX + v3.x * scale, centerY - v3.y * scale);
            drawLine(centerX + v3.x * scale, centerY - v3.y * scale, centerX + v0.x * scale, centerY - v0.y * scale);
        }
    }

    graphics.closePath();
    graphics.strokePath();
}

function drawLine (x0, y0, x1, y1)
{
    graphics.moveTo(x0, y0);
    graphics.lineTo(x1, y1);
}

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

//  Parses out tris and quads from the obj file
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
