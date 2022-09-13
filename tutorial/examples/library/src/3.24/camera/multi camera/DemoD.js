var DemoD = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function DemoD ()
    {
        Phaser.Scene.call(this, { key: 'DemoD', active: true });

        this.graphics;

        this.t = {
            x: -0.03490658503988659,
            y: 0.03490658503988659,
            z: -0.03490658503988659
        };

        this.modelData = {};

        this.objects = [];
    },

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

        this.tweens.add({
            targets: t,
            duration: 2000,
            scale: 10,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.tweens.add({
            targets: c,
            duration: 4000,
            scale: 10,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        var cam = this.cameras.main;

        cam.x = 800;
        cam.y = 600;
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

});