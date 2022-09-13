var Camera3D = new Phaser.Class({

    initialize:

    function Camera3D ()
    {
        this.position = BABYLON.Vector3.Zero();
        this.target = BABYLON.Vector3.Zero();
    }

});

var Mesh = new Phaser.Class({

    initialize:

    function Mesh (data, x, y, z)
    {
        this.vertices = data.verts;
        this.faces = data.faces;

        this.visible = true;

        this.position = new BABYLON.Vector3(x, y, z);
        this.rotation = BABYLON.Vector3.Zero();
        this.scale = new BABYLON.Vector3(1, 1, 1);

        this.thickness = 2;
        this.color = 0x00ff00;
        this.alpha = 1;

        this._pA = BABYLON.Vector2.Zero();
        this._pB = BABYLON.Vector2.Zero();
        this._pC = BABYLON.Vector2.Zero();
        this._pD = BABYLON.Vector2.Zero();
    },

    /*
    fadeOut: function (duration)
    {
        if (duration === undefined) { duration = 1; }

        TweenMax.to(this, duration, {
            alpha: 0,
            ease: Linear.easeNone,
        });
    },

    fadeIn: function (duration)
    {
        if (duration === undefined) { duration = 1; }

        this.alpha = 0;
        this.visible = true;

        TweenMax.to(this, duration, {
            alpha: 1,
            ease: Linear.easeNone,
        });
    },
    */

    render: function (graphics, viewMatrix, projectionMatrix)
    {
        if (!this.visible || this.alpha === 0)
        {
            return;
        }

        var worldMatrix = BABYLON.Matrix.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z).multiply(BABYLON.Matrix.Translation(this.position.x, this.position.y, this.position.z)).multiply(BABYLON.Matrix.Scaling(this.scale.x, this.scale.y, this.scale.z));

        var transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

        graphics.lineStyle(this.thickness, this.color, this.alpha);
        graphics.beginPath();

        for (var f = 0; f < this.faces.length; f++)
        {
            var face = this.faces[f];
            var verts = this.vertices;

            this.project(this._pA, verts[face.A].pos, transformMatrix);
            this.project(this._pB, verts[face.B].pos, transformMatrix);
            this.project(this._pC, verts[face.C].pos, transformMatrix);
            this.project(this._pD, verts[face.D].pos, transformMatrix);

            this.drawLine(graphics, this._pA, this._pB);
            this.drawLine(graphics, this._pB, this._pC);
            this.drawLine(graphics, this._pC, this._pD);
            this.drawLine(graphics, this._pD, this._pA);
        }

        graphics.closePath();
        graphics.strokePath();
    },

    drawLine: function (graphics, pointA, pointB)
    {
        graphics.moveTo(pointA.x, pointA.y);
        graphics.lineTo(pointB.x, pointB.y);
    },

    project: function (local, coord, transMat)
    {
        var point = BABYLON.Vector3.TransformCoordinates(coord, transMat);

        local.x = point.x * 800 + 800 / 2.0 >> 0;
        local.y = -point.y * 600 + 600 / 2.0 >> 0;
    },

});

var Bullet = new Phaser.Class({

    Extends: Mesh,

    initialize:

    function Bullet (data)
    {
        Mesh.call(this, data, 0, 0, 0);

        this.color = 0xffffff;

        // this.scale.x = 1;
        // this.scale.y = 1;
        // this.scale.z = 1;

        this.visible = false;

        this.alive = false;

        this.speed = 1;
    },

    fire: function (x, y, z)
    {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.visible = true;
        this.alive = true;

        // this.alpha = 0;
        // this.fadeIn();
    },

    update: function ()
    {
        this.position.z += this.speed;

        //  Check distance and kill off
        if (this.position.z >= 64)
        {
            this.kill();
        }
    },

    kill: function ()
    {
        this.visible = false;
        this.alive = false;
    }

});

var Invader = new Phaser.Class({

    Extends: Mesh,

    initialize:

    function Invader (data)
    {
        Mesh.call(this, data, 0, 0, 0);

        this.color = 0x00ff00;

        // this.scale.x = 1;
        // this.scale.y = 1;
        // this.scale.z = 1;

        this.visible = false;

        this.alive = false;

        this.speed = 0.2;
    },

    launch: function (x, y, z)
    {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.visible = true;
        this.alive = true;

        // this.alpha = 0;
        // this.fadeIn();
    },

    update: function ()
    {
        this.position.z -= this.speed;

        //  Check distance and kill off
        if (this.position.z <= -30)
        {
            this.kill();
        }
    },

    kill: function ()
    {
        this.visible = false;
        this.alive = false;
    }

});

var Cannon = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Cannon ()
    {
        Phaser.Scene.call(this, { key: 'cannon' });

        this.camera3D;
        this.graphics;

        this.player;
        this.cursors;
        this.lastFired = 0;

        this.invaders = [];
        this.bullets = [];
        this.meshes = [];
        this.modelData = {};
    },

    preload: function ()
    {
        this.load.text('bullet', 'assets/text/bullet.obj');
        this.load.text('tank', 'assets/text/ship.obj');
        this.load.text('invader', 'assets/text/invader.obj');
        this.load.text('grid', 'assets/text/grid.obj');
    },

    create: function ()
    {
        this.parseObj('bullet');
        this.parseObj('tank');
        this.parseObj('invader');
        this.parseObj('grid');

        var grid = new Mesh(this.getMeshData('grid'), 0, 0, 7);

        grid.color = 0xff00ff;
        grid.scale.x = 4;
        grid.scale.y = 4;
        grid.scale.z = 4;

        this.meshes.push(grid);

        this.player = new Mesh(this.getMeshData('tank'), 0, 1, -9);

        this.player.color = 0xffff00;
        this.player.rotation.x = Phaser.Math.DegToRad(180);
        this.player.rotation.z = Phaser.Math.DegToRad(180);

        this.meshes.push(this.player);

        //  bullets

        for (var i = 0; i < 6; i++)
        {
            var bullet = new Bullet(this.getMeshData('bullet'));

            this.meshes.push(bullet);

            this.bullets.push(bullet);
        }

        //  invaders

        for (var i = 0; i < 6; i++)
        {
            var invader = new Invader(this.getMeshData('invader'));

            this.meshes.push(invader);

            this.invaders.push(invader);
        }

        this.graphics = this.add.graphics();

        this.camera3D = new Camera3D();

        this.camera3D.position = new BABYLON.Vector3(0, 6, -32);
        this.camera3D.target = new BABYLON.Vector3(0, 0, 50);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.invaders[0].launch(-8, 1, 60);
        this.invaders[1].launch(-4, 1, 90);
        this.invaders[2].launch(0, 1, 260);
        this.invaders[3].launch(4, 1, 160);
        this.invaders[4].launch(8, 1, 200);

    },

    getMeshData: function (key)
    {
        var data = Phaser.Utils.Objects.Extend(true, this.modelData[key], {});

        return data;
    },

    update: function (time, delta)
    {
        this.updateCamControls(time);

        //  update bullets

        for (var i = 0; i < this.bullets.length; i++)
        {
            if (this.bullets[i].alive)
            {
                this.bullets[i].update(delta);
            }
        }

        //  update invaders

        for (var i = 0; i < this.invaders.length; i++)
        {
            if (this.invaders[i].alive)
            {
                this.invaders[i].update(delta);
            }
        }

        this.graphics.clear();

        var viewMatrix = BABYLON.Matrix.LookAtLH(this.camera3D.position, this.camera3D.target, BABYLON.Vector3.Up());
        var projectionMatrix = BABYLON.Matrix.PerspectiveFovLH(0.8, 800 / 600, 0.01, 1.0);

        for (var i = 0; i < this.meshes.length; i++)
        {
            var mesh = this.meshes[i];

            mesh.render(this.graphics, viewMatrix, projectionMatrix);
        }
    },

    updateCamControls: function (time, delta)
    {
        if (this.cursors.left.isDown)
        {
            this.player.position.x -= 0.2;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.position.x += 0.2;
        }

        if (this.cursors.space.isDown && time > this.lastFired)
        {
            for (var i = 0; i < this.bullets.length; i++)
            {
                var bullet = this.bullets[i];

                if (!bullet.alive)
                {
                    bullet.fire(this.player.position.x, this.player.position.y, this.player.position.z);
                    this.lastFired = time + 100;
                    break;
                }
            }
        }
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

                var pos = new BABYLON.Vector3(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
                var normal = new BABYLON.Vector3();

                if (tokens.length > 3)
                {
                    normal.x = parseFloat(tokens[4]);
                    normal.y = parseFloat(tokens[5]);
                    normal.z = parseFloat(tokens[6]);
                }

                verts.push({
                    pos: pos,
                    normal: normal
                });
            }
            else if (line[0] === 'f')
            {
                // lines that start with 'f' are faces
                var tokens = line.split(' ');

                var face = {
                    A: parseInt(tokens[1], 10),
                    B: parseInt(tokens[2], 10),
                    C: parseInt(tokens[3], 10),
                    D: parseInt(tokens[4], 10)
                };
            
                if (face.A < 0)
                {
                    face.A = verts.length + face.A;
                }
                else
                {
                    face.A--;
                }

                if (face.B < 0)
                {
                    face.B = verts.length + face.B;
                }
                else
                {
                    face.B--;
                }

                if (face.C < 0)
                {
                    face.C = verts.length + face.C;
                }
                else
                {
                    face.C--;
                }

                if (!face.D)
                {
                    face.D = face.C;
                }
                else if (face.D < 0)
                {
                    face.D = verts.length + face.D;
                }
                else
                {
                    face.D--;
                }

                faces.push(face);
            }
        }

        //  Compute normals
        for (var i = 0; i < faces.length; i++)
        {
            var face = faces[i];

            var vertA = verts[face.A];
            var vertB = verts[face.B];
            var vertC = verts[face.C];

            face.normal = (vertA.normal.add(vertB.normal.add(vertC.normal))).scale(1 / 3);
            face.normal.normalize();
        }

        this.modelData[key] = {
            verts: verts,
            faces: faces
        };
      
        return this.modelData[key];
    }

});


var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Cannon ],
    physics: {
        default: 'arcade'
    }
};

var game = new Phaser.Game(config);

