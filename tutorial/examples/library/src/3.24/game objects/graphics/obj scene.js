var Obj3D = new Phaser.Class({

    initialize:

    function Obj3D (camera, modelData, x, y, z)
    {
        this.camera = camera;
        this.model = modelData;

        this.x = x;
        this.y = y;
        this.z = z;

        this.thickness = 2;
        this.color = 0x00ff00;
        this.alpha = 1;

        this.scale = 100;
    },

    rotateX: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        var model = this.model;
        
        for (var n = 0; n < model.verts.length; n++)
        {
            var vert = model.verts[n];
            var y = vert.y;
            var z = vert.z;

            vert.y = y * tc - z * ts;
            vert.z = z * tc + y * ts;
        }
    },

    rotateY: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        var model = this.model;
        
        for (var n = 0; n < model.verts.length; n++)
        {
            var vert = model.verts[n];
            var x = vert.x;
            var z = vert.z;

            vert.x = x * tc - z * ts;
            vert.z = z * tc + x * ts;
        }
    },

    rotateZ: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        var model = this.model;
        
        for (var n = 0; n < model.verts.length; n++)
        {
            var vert = model.verts[n];
            var x = vert.x;
            var y = vert.y;

            vert.x = x * tc - y * ts;
            vert.y = y * tc + x * ts;
        }
    },

    render: function (graphics)
    {
        var model = this.model;

        var x = this.camera.x + this.x;
        var y = this.camera.y + this.y;
        var z = this.z;
        var scale = this.scale;

        graphics.lineStyle(this.thickness, this.color, this.alpha);

        graphics.beginPath();

        for (var i = 0; i < model.faces.length; i++)
        {
            var face = model.faces[i];

            var v0 = model.verts[face[0] - 1];
            var v1 = model.verts[face[1] - 1];
            var v2 = model.verts[face[2] - 1];
            var v3 = model.verts[face[3] - 1];

            // if (v0 && v1 && v2 && v3)
            // {
                this.drawLine(graphics, x + v0.x * scale, y - v0.y * scale, x + v1.x * scale, y - v1.y * scale);
                this.drawLine(graphics, x + v1.x * scale, y - v1.y * scale, x + v2.x * scale, y - v2.y * scale);
                this.drawLine(graphics, x + v2.x * scale, y - v2.y * scale, x + v3.x * scale, y - v3.y * scale);
                this.drawLine(graphics, x + v3.x * scale, y - v3.y * scale, x + v0.x * scale, y - v0.y * scale);
            // }
        }

        graphics.closePath();
        graphics.strokePath();
    },

    drawLine: function (graphics, x0, y0, x1, y1)
    {
        graphics.moveTo(x0, y0);
        graphics.lineTo(x1, y1);
    }

});

var WireframeScene = {};

WireframeScene.Start = function ()
{
    this.graphics;

    this.t = {
        x: -0.03490658503988659,
        y: 0.03490658503988659,
        z: -0.03490658503988659
    };

    this.modelData = {};

    this.objects = [];
};

WireframeScene.Start.prototype.constructor = WireframeScene.Start;

WireframeScene.Start.prototype = {

    preload: function ()
    {
        this.load.text('bevelledcube', 'assets/text/bevelledcube.obj');
        this.load.text('computer', 'assets/text/computer.obj');
        this.load.text('geosphere', 'assets/text/geosphere.obj');
        this.load.text('spike', 'assets/text/spike.obj');
        this.load.text('torus', 'assets/text/torus.obj');
    },

    create: function ()
    {
        this.parseObj('bevelledcube');
        this.parseObj('computer');
        this.parseObj('geosphere');
        this.parseObj('spike');
        this.parseObj('torus');

        this.graphics = this.add.graphics();

        this.camera = {
            x: 400,
            y: 340
        };

        var b = this.addObject('bevelledcube', -200, -200, 0);

        var g = this.addObject('geosphere', 200, -200, 0);
        g.color = 0x00ffff;

        var t = this.addObject('torus', -200, 100, 0);
        t.color = 0xff00ff;
        t.scale = 200;

        var c = this.addObject('computer', 200, 100, 0);
        c.color = 0xffff00;

        TweenMax.to(t, 2, {
            scale: 10,
            ease: Sine.easeInOut,
            repeat: -1,
            yoyo: true
        });

        TweenMax.to(c, 4, {
            scale: 10,
            ease: Sine.easeInOut,
            repeat: -1,
            yoyo: true
        });

    },

    update: function ()
    {
        this.graphics.clear();

        for (var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].rotateX(0.01);
            this.objects[i].rotateY(0.03);
            this.objects[i].rotateZ(0.01);
            this.objects[i].render(this.graphics);
        }
    },

    addObject: function (key, x, y, z)
    {
        var model = new Obj3D(this.camera, this.getModel(key), x, y, z);

        this.objects.push(model);

        return model;
    },

    getModel: function (key)
    {
        var data = Phaser.Utils.Objects.Extend(true, this.modelData[key], {});

        return data;
    },

    //  Parses out tris and quads from the obj file
    parseObj: function (key)
    {
        var text = this.cache.text.get(key);

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

        this.modelData[key] = {
            verts: verts,
            faces: faces
        };
      
        return this.modelData[key];
    }
};

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: WireframeScene.Start
};

var game = new Phaser.Game(config);
