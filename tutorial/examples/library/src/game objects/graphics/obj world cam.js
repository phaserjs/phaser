var Camera = new Phaser.Class({

    initialize:

    function Camera ()
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

var Cube = new Phaser.Class({

    Extends: Mesh,

    initialize:

    function Cube (data)
    {
        var x = Phaser.Math.Between(8.2, 24);

        if (Math.random() > 0.5)
        {
            x = -x;
        }

        Mesh.call(this, data, x, 0, 64);

        this.color = 0xffffff;

        this.visible = false;

        this.speed = Phaser.Math.Between(4, 10);

        this.jump = new TimelineMax({ delay: Math.random() * 4, repeat: -1, repeatDelay: 2 });

        this.jump.add(TweenMax.to(this.position, 2, { y: 6, ease: Bounce.easeIn }));
        this.jump.add(TweenMax.to(this.position, 2, { y: 0, ease: Bounce.easeOut }));
        this.jump.pause();

        TweenMax.delayedCall(Math.random() * 8, this.begin, [], this);
    },

    begin: function ()
    {
        this.jump.restart();

        this.visible = true;

        this.alpha = 0;

        this.fadeIn();

        TweenMax.to(this.rotation, 2, {
            x: -6,
            ease: Linear.easeNone,
            repeat: -1
        });

        TweenMax.to(this.position, this.speed, {
            z: -8,
            ease: Linear.easeNone,
            onComplete: this.reset,
            onCompleteScope: this
        });
    },

    reset: function ()
    {
        this.position.y = 0;
        this.position.z = 64;

        this.alpha = 0;

        this.fadeIn();

        TweenMax.to(this.position, this.speed, {
            z: -8,
            ease: Linear.easeNone,
            onComplete: this.reset,
            onCompleteScope: this
        });
    }

});

var WireframeScene = {};

WireframeScene.Start = function ()
{
    this.graphics;

    this.meshes = [];

    this.current;

    this.logo;
    this.sphere;
    this.torus;
    this.spike;

    this.computer;
    this.camera;

    this.sequence1 = false;
    this.sequence2 = false;

    this.modelData = {};
};

WireframeScene.Start.prototype.constructor = WireframeScene.Start;

WireframeScene.Start.prototype = {

    preload: function ()
    {
        this.load.image('sky', 'assets/demoscene/sky.png');
        this.load.text('bevelledcube', 'assets/text/bevelledcube.obj');
        this.load.text('computer', 'assets/text/computer.obj');
        this.load.text('geosphere', 'assets/text/geosphere.obj');
        this.load.text('spike', 'assets/text/spike.obj');
        this.load.text('torus', 'assets/text/torus.obj');
        this.load.text('grid', 'assets/text/grid.obj');
        this.load.text('logo', 'assets/text/phaser-logo-3d.obj');
    },

    create: function ()
    {
        this.parseObj('bevelledcube');
        this.parseObj('computer');
        this.parseObj('geosphere');
        this.parseObj('spike');
        this.parseObj('torus');
        this.parseObj('grid');
        this.parseObj('logo');

        this.add.image(400, 42, 'sky');

        this.graphics = this.add.graphics();

        this.newScene();

        this.camera3D = new Camera();

        this.camera3D.position = new BABYLON.Vector3(0, 6, -32);
        this.camera3D.target = new BABYLON.Vector3(0, 0, 50);

        TweenMax.to(this.camera3D.position, 4, {
            delay: 24,
            z: -12,
            ease: Sine.easeInOut,
            repeat: -1,
            yoyo: true
        });

        TweenMax.to(this.camera3D.position, 2, {
            delay: 24,
            y: 8,
            ease: Sine.easeInOut,
            repeat: -1,
            yoyo: true
        });

        TweenMax.delayedCall(6, function () { this.sequence2 = true; }, [], this);
        TweenMax.delayedCall(17, function () { this.sequence1 = true; }, [], this);
        TweenMax.delayedCall(20, this.changeShape, [], this);

        this.cameras.main.setSize(800, 600);

        var miniCam = this.cameras.add(400, 0, 400, 300);

        miniCam.setBackgroundColor('#000000');
        miniCam.zoom = 0.5;
        miniCam.scrollX = 200;
        miniCam.scrollY = 150;
    },

    changeShape: function ()
    {
        if (this.current === this.logo)
        {
            this.logo.fadeOut(3);
            this.sphere.fadeIn();
            this.current = this.sphere;
        }
        else if (this.current === this.sphere)
        {
            this.sphere.fadeOut(3);
            this.torus.fadeIn();
            this.current = this.torus;
        }
        else if (this.current === this.torus)
        {
            this.torus.fadeOut(3);
            this.spike.fadeIn();
            this.current = this.spike;
            
        }
        else if (this.current === this.spike)
        {
            this.spike.fadeOut(3);
            this.logo.fadeIn();
            this.current = this.logo;
        }

        TweenMax.delayedCall(8, this.changeShape, [], this);
    },

    newScene: function ()
    {
        var grid = new Mesh(this.getMeshData('grid'), 0, 0, 7);

        grid.color = 0xff00ff;
        grid.scale.x = 4;
        grid.scale.y = 4;
        grid.scale.z = 4;

        this.meshes.push(grid);

        for (var c = 0; c < 16; c++)
        {
            this.meshes.push(new Cube(this.getMeshData('bevelledcube')))
        }

        this.computer = new Mesh(this.getMeshData('computer'), 0, 1.4, 1);

        this.computer.color = 0xffff00;
        this.computer.scale.x = 4;
        this.computer.scale.y = 4;
        this.computer.scale.z = 4;

        this.logo = new Mesh(this.getMeshData('logo'), 0, 18, 2);

        this.logo.scale.x = 0.3;
        this.logo.scale.y = 0.3;
        this.logo.scale.z = 0.3;

        this.logo.visible = true;

        this.sphere = new Mesh(this.getMeshData('geosphere'), 0, 3.5, 0);

        this.sphere.color = 0xff0000;
        this.sphere.scale.x = 1.5;
        this.sphere.scale.y = 1.5;
        this.sphere.scale.z = 1.5;

        this.sphere.visible = false;

        this.torus = new Mesh(this.getMeshData('torus'), 0, 3.5, 0);

        this.torus.color = 0xf69679;
        this.torus.scale.x = 1.6;
        this.torus.scale.y = 1.6;
        this.torus.scale.z = 1.6;

        this.torus.visible = false;

        this.spike = new Mesh(this.getMeshData('spike'), 0, 6.8, 0);

        this.spike.color = 0x00ffff;
        this.spike.scale.x = 0.8;
        this.spike.scale.y = 0.8;
        this.spike.scale.z = 0.8;

        this.spike.visible = false;

        this.current = this.logo;

        this.meshes.push(this.computer);
        this.meshes.push(this.logo);
        this.meshes.push(this.sphere);
        this.meshes.push(this.torus);
        this.meshes.push(this.spike);
    },

    getMeshData: function (key)
    {
        var data = Phaser.Utils.Objects.Extend(true, this.modelData[key], {});

        return data;
    },

    update: function ()
    {
        if (this.sequence1)
        {
            this.logo.rotation.x -= 0.05;
            this.sphere.rotation.x -= 0.05;
            this.torus.rotation.x -= 0.05;
            this.spike.rotation.x -= 0.05;
        }

        if (this.sequence2)
        {
            this.logo.rotation.y -= 0.01;
            this.sphere.rotation.y -= 0.01;
            this.torus.rotation.y -= 0.01;
            this.spike.rotation.y -= 0.01;

            this.computer.rotation.y -= 0.01;
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
};

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: WireframeScene.Start
};

var game = new Phaser.Game(config);

//  Everything below here is just an export of the Babylon.js Math class

var BABYLON;
(function (BABYLON) {
    var Color4 = (function () {
        function Color4(initialR, initialG, initialB, initialA) {
            this.r = initialR;
            this.g = initialG;
            this.b = initialB;
            this.a = initialA;
        }
        Color4.prototype.toString = function () {
            return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
        };
        return Color4;
    })();
    BABYLON.Color4 = Color4;    
    var Vector2 = (function () {
        function Vector2(initialX, initialY) {
            this.x = initialX;
            this.y = initialY;
        }
        Vector2.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + "}";
        };
        Vector2.prototype.add = function (otherVector) {
            return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
        };
        Vector2.prototype.subtract = function (otherVector) {
            return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
        };
        Vector2.prototype.negate = function () {
            return new Vector2(-this.x, -this.y);
        };
        Vector2.prototype.scale = function (scale) {
            return new Vector2(this.x * scale, this.y * scale);
        };
        Vector2.prototype.equals = function (otherVector) {
            return this.x === otherVector.x && this.y === otherVector.y;
        };
        Vector2.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Vector2.prototype.lengthSquared = function () {
            return (this.x * this.x + this.y * this.y);
        };
        Vector2.prototype.normalize = function () {
            var len = this.length();
            if(len === 0) {
                return;
            }
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
        };
        Vector2.Zero = function Zero() {
            return new Vector2(0, 0);
        };
        Vector2.Copy = function Copy(source) {
            return new Vector2(source.x, source.y);
        };
        Vector2.Normalize = function Normalize(vector) {
            var newVector = Vector2.Copy(vector);
            newVector.normalize();
            return newVector;
        };
        Vector2.Minimize = function Minimize(left, right) {
            var x = (left.x < right.x) ? left.x : right.x;
            var y = (left.y < right.y) ? left.y : right.y;
            return new Vector2(x, y);
        };
        Vector2.Maximize = function Maximize(left, right) {
            var x = (left.x > right.x) ? left.x : right.x;
            var y = (left.y > right.y) ? left.y : right.y;
            return new Vector2(x, y);
        };
        Vector2.Transform = function Transform(vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]);
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]);
            return new Vector2(x, y);
        };
        Vector2.Distance = function Distance(value1, value2) {
            return Math.sqrt(Vector2.DistanceSquared(value1, value2));
        };
        Vector2.DistanceSquared = function DistanceSquared(value1, value2) {
            var x = value1.x - value2.x;
            var y = value1.y - value2.y;
            return (x * x) + (y * y);
        };
        return Vector2;
    })();
    BABYLON.Vector2 = Vector2;    
    var Vector3 = (function () {
        function Vector3(initialX, initialY, initialZ) {
            this.x = initialX;
            this.y = initialY;
            this.z = initialZ;
        }
        Vector3.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
        };
        Vector3.prototype.add = function (otherVector) {
            return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
        };
        Vector3.prototype.subtract = function (otherVector) {
            return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
        };
        Vector3.prototype.negate = function () {
            return new Vector3(-this.x, -this.y, -this.z);
        };
        Vector3.prototype.scale = function (scale) {
            return new Vector3(this.x * scale, this.y * scale, this.z * scale);
        };
        Vector3.prototype.equals = function (otherVector) {
            return this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
        };
        Vector3.prototype.multiply = function (otherVector) {
            return new Vector3(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
        };
        Vector3.prototype.divide = function (otherVector) {
            return new Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
        };
        Vector3.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.lengthSquared = function () {
            return (this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.normalize = function () {
            var len = this.length();
            if(len === 0) {
                return;
            }
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
            this.z *= num;
        };
        Vector3.FromArray = function FromArray(array, offset) {
            if(!offset) {
                offset = 0;
            }
            return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
        };
        Vector3.Zero = function Zero() {
            return new Vector3(0, 0, 0);
        };
        Vector3.Up = function Up() {
            return new Vector3(0, 1.0, 0);
        };
        Vector3.Copy = function Copy(source) {
            return new Vector3(source.x, source.y, source.z);
        };
        Vector3.TransformCoordinates = function TransformCoordinates(vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            return new Vector3(x / w, y / w, z / w);
        };
        Vector3.TransformNormal = function TransformNormal(vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
            return new Vector3(x, y, z);
        };
        Vector3.Dot = function Dot(left, right) {
            return (left.x * right.x + left.y * right.y + left.z * right.z);
        };
        Vector3.Cross = function Cross(left, right) {
            var x = left.y * right.z - left.z * right.y;
            var y = left.z * right.x - left.x * right.z;
            var z = left.x * right.y - left.y * right.x;
            return new Vector3(x, y, z);
        };
        Vector3.Normalize = function Normalize(vector) {
            var newVector = Vector3.Copy(vector);
            newVector.normalize();
            return newVector;
        };
        Vector3.Distance = function Distance(value1, value2) {
            return Math.sqrt(Vector3.DistanceSquared(value1, value2));
        };
        Vector3.DistanceSquared = function DistanceSquared(value1, value2) {
            var x = value1.x - value2.x;
            var y = value1.y - value2.y;
            var z = value1.z - value2.z;
            return (x * x) + (y * y) + (z * z);
        };
        return Vector3;
    })();
    BABYLON.Vector3 = Vector3;    
    var Matrix = (function () {
        function Matrix() {
            this.m = [];
        }
        Matrix.prototype.isIdentity = function () {
            if(this.m[0] != 1.0 || this.m[5] != 1.0 || this.m[10] != 1.0 || this.m[15] != 1.0) {
                return false;
            }
            if(this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0 || this.m[4] != 0.0 || this.m[6] != 0.0 || this.m[7] != 0.0 || this.m[8] != 0.0 || this.m[9] != 0.0 || this.m[11] != 0.0 || this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0) {
                return false;
            }
            return true;
        };
        Matrix.prototype.determinant = function () {
            var temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]);
            var temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]);
            var temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]);
            var temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]);
            var temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]);
            var temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);
            return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
        };
        Matrix.prototype.toArray = function () {
            return this.m;
        };
        Matrix.prototype.invert = function () {
            var l1 = this.m[0];
            var l2 = this.m[1];
            var l3 = this.m[2];
            var l4 = this.m[3];
            var l5 = this.m[4];
            var l6 = this.m[5];
            var l7 = this.m[6];
            var l8 = this.m[7];
            var l9 = this.m[8];
            var l10 = this.m[9];
            var l11 = this.m[10];
            var l12 = this.m[11];
            var l13 = this.m[12];
            var l14 = this.m[13];
            var l15 = this.m[14];
            var l16 = this.m[15];
            var l17 = (l11 * l16) - (l12 * l15);
            var l18 = (l10 * l16) - (l12 * l14);
            var l19 = (l10 * l15) - (l11 * l14);
            var l20 = (l9 * l16) - (l12 * l13);
            var l21 = (l9 * l15) - (l11 * l13);
            var l22 = (l9 * l14) - (l10 * l13);
            var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            var l28 = (l7 * l16) - (l8 * l15);
            var l29 = (l6 * l16) - (l8 * l14);
            var l30 = (l6 * l15) - (l7 * l14);
            var l31 = (l5 * l16) - (l8 * l13);
            var l32 = (l5 * l15) - (l7 * l13);
            var l33 = (l5 * l14) - (l6 * l13);
            var l34 = (l7 * l12) - (l8 * l11);
            var l35 = (l6 * l12) - (l8 * l10);
            var l36 = (l6 * l11) - (l7 * l10);
            var l37 = (l5 * l12) - (l8 * l9);
            var l38 = (l5 * l11) - (l7 * l9);
            var l39 = (l5 * l10) - (l6 * l9);
            this.m[0] = l23 * l27;
            this.m[4] = l24 * l27;
            this.m[8] = l25 * l27;
            this.m[12] = l26 * l27;
            this.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            this.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            this.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            this.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            this.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            this.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            this.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            this.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            this.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            this.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            this.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            this.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
        };
        Matrix.prototype.multiply = function (other) {
            var result = new Matrix();
            result.m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
            result.m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
            result.m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
            result.m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];
            result.m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
            result.m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
            result.m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
            result.m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];
            result.m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
            result.m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
            result.m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
            result.m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];
            result.m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
            result.m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
            result.m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
            result.m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
            return result;
        };
        Matrix.prototype.equals = function (value) {
            return (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
        };
        Matrix.FromValues = function FromValues(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
            var result = new Matrix();
            result.m[0] = initialM11;
            result.m[1] = initialM12;
            result.m[2] = initialM13;
            result.m[3] = initialM14;
            result.m[4] = initialM21;
            result.m[5] = initialM22;
            result.m[6] = initialM23;
            result.m[7] = initialM24;
            result.m[8] = initialM31;
            result.m[9] = initialM32;
            result.m[10] = initialM33;
            result.m[11] = initialM34;
            result.m[12] = initialM41;
            result.m[13] = initialM42;
            result.m[14] = initialM43;
            result.m[15] = initialM44;
            return result;
        };
        Matrix.Identity = function Identity() {
            return Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
        };
        Matrix.Zero = function Zero() {
            return Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Matrix.Copy = function Copy(source) {
            return Matrix.FromValues(source.m[0], source.m[1], source.m[2], source.m[3], source.m[4], source.m[5], source.m[6], source.m[7], source.m[8], source.m[9], source.m[10], source.m[11], source.m[12], source.m[13], source.m[14], source.m[15]);
        };
        Matrix.RotationX = function RotationX(angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[0] = 1.0;
            result.m[15] = 1.0;
            result.m[5] = c;
            result.m[10] = c;
            result.m[9] = -s;
            result.m[6] = s;
            return result;
        };
        Matrix.RotationY = function RotationY(angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[5] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[2] = -s;
            result.m[8] = s;
            result.m[10] = c;
            return result;
        };
        Matrix.RotationZ = function RotationZ(angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[10] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[1] = s;
            result.m[4] = -s;
            result.m[5] = c;
            return result;
        };
        Matrix.RotationAxis = function RotationAxis(axis, angle) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            axis.normalize();
            var result = Matrix.Zero();
            result.m[0] = (axis.x * axis.x) * c1 + c;
            result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
            result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
            result.m[3] = 0.0;
            result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
            result.m[5] = (axis.y * axis.y) * c1 + c;
            result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
            result.m[7] = 0.0;
            result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
            result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
            result.m[10] = (axis.z * axis.z) * c1 + c;
            result.m[11] = 0.0;
            result.m[15] = 1.0;
            return result;
        };
        Matrix.RotationYawPitchRoll = function RotationYawPitchRoll(yaw, pitch, roll) {
            return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
        };
        Matrix.Scaling = function Scaling(x, y, z) {
            var result = Matrix.Zero();
            result.m[0] = x;
            result.m[5] = y;
            result.m[10] = z;
            result.m[15] = 1.0;
            return result;
        };
        Matrix.Translation = function Translation(x, y, z) {
            var result = Matrix.Identity();
            result.m[12] = x;
            result.m[13] = y;
            result.m[14] = z;
            return result;
        };
        Matrix.LookAtLH = function LookAtLH(eye, target, up) {
            var zAxis = target.subtract(eye);
            zAxis.normalize();
            var xAxis = Vector3.Cross(up, zAxis);
            xAxis.normalize();
            var yAxis = Vector3.Cross(zAxis, xAxis);
            yAxis.normalize();
            var ex = -Vector3.Dot(xAxis, eye);
            var ey = -Vector3.Dot(yAxis, eye);
            var ez = -Vector3.Dot(zAxis, eye);
            return Matrix.FromValues(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1);
        };
        Matrix.PerspectiveLH = function PerspectiveLH(width, height, znear, zfar) {
            var matrix = Matrix.Zero();
            matrix.m[0] = (2.0 * znear) / width;
            matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
            matrix.m[5] = (2.0 * znear) / height;
            matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
            matrix.m[10] = -zfar / (znear - zfar);
            matrix.m[8] = matrix.m[9] = 0.0;
            matrix.m[11] = 1.0;
            matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
            matrix.m[14] = (znear * zfar) / (znear - zfar);
            return matrix;
        };
        Matrix.PerspectiveFovLH = function PerspectiveFovLH(fov, aspect, znear, zfar) {
            var matrix = Matrix.Zero();
            var tan = 1.0 / (Math.tan(fov * 0.5));
            matrix.m[0] = tan / aspect;
            matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
            matrix.m[5] = tan;
            matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
            matrix.m[8] = matrix.m[9] = 0.0;
            matrix.m[10] = -zfar / (znear - zfar);
            matrix.m[11] = 1.0;
            matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
            matrix.m[14] = (znear * zfar) / (znear - zfar);
            return matrix;
        };
        Matrix.Transpose = function Transpose(matrix) {
            var result = new Matrix();
            result.m[0] = matrix.m[0];
            result.m[1] = matrix.m[4];
            result.m[2] = matrix.m[8];
            result.m[3] = matrix.m[12];
            result.m[4] = matrix.m[1];
            result.m[5] = matrix.m[5];
            result.m[6] = matrix.m[9];
            result.m[7] = matrix.m[13];
            result.m[8] = matrix.m[2];
            result.m[9] = matrix.m[6];
            result.m[10] = matrix.m[10];
            result.m[11] = matrix.m[14];
            result.m[12] = matrix.m[3];
            result.m[13] = matrix.m[7];
            result.m[14] = matrix.m[11];
            result.m[15] = matrix.m[15];
            return result;
        };
        return Matrix;
    })();
    BABYLON.Matrix = Matrix;    
})(BABYLON || (BABYLON = {}));
