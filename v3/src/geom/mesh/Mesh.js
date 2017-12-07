var Class = require('../../utils/Class');
var Matrix4 = require('../../math/Matrix4');
var Vector2 = require('../../math/Vector2');
var Vector3 = require('../../math/Vector3');

var Mesh = new Class({

    initialize:

    function Mesh (data, x, y, z)
    {
        this.vertices = data.verts;
        this.faces = data.faces;

        this.position = new Vector3(x, y, z);
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);

        this.visible = true;

        this.thickness = 1;
        this.strokeColor = 0x00ff00;
        this.strokeAlpha = 1;

        this.fillColor = 0x00ff00;
        this.fillAlpha = 1;

        this._pA = new Vector2();
        this._pB = new Vector2();
        this._pC = new Vector2();
        this._pD = new Vector2();

        this._tempVec3 = new Vector3();

        this.worldMatrix = new Matrix4();
    },

    fill: function (graphics)
    {
        if (!this.visible || this.alpha === 0)
        {
            return;
        }

        var pa = this._pA;
        var pb = this._pB;
        var pc = this._pC;

        var world = this.worldMatrix;

        world.setWorldMatrix(this.rotation, this.position, this.scale, graphics.viewMatrix, graphics.projectionMatrix);

        graphics.fillStyle(this.fillColor, this.fillAlpha);

        for (var f = 0; f < this.faces.length; f++)
        {
            var face = this.faces[f];
            var verts = this.vertices;

            this.project(graphics, pa, verts[face.A].pos, world);
            this.project(graphics, pb, verts[face.B].pos, world);
            this.project(graphics, pc, verts[face.C].pos, world);

            graphics.fillTriangle(pa.x, pa.y, pb.x, pb.y, pc.x, pc.y);
        }
    },

    stroke: function (graphics)
    {
        if (!this.visible || this.alpha === 0)
        {
            return;
        }

        var pa = this._pA;
        var pb = this._pB;
        var pc = this._pC;
        var pd = this._pD;

        var world = this.worldMatrix;

        world.setWorldMatrix(this.rotation, this.position, this.scale, graphics.viewMatrix, graphics.projectionMatrix);

        graphics.lineStyle(this.thickness, this.strokeColor, this.strokeAlpha);
        graphics.beginPath();

        for (var f = 0; f < this.faces.length; f++)
        {
            var face = this.faces[f];
            var verts = this.vertices;

            this.project(graphics, pa, verts[face.A].pos, world);
            this.project(graphics, pb, verts[face.B].pos, world);
            this.project(graphics, pc, verts[face.C].pos, world);
            this.project(graphics, pd, verts[face.D].pos, world);

            graphics.moveTo(pa.x, pa.y);
            graphics.lineTo(pb.x, pb.y);

            graphics.moveTo(pb.x, pb.y);
            graphics.lineTo(pc.x, pc.y);

            graphics.moveTo(pc.x, pc.y);
            graphics.lineTo(pd.x, pd.y);

            graphics.moveTo(pd.x, pd.y);
            graphics.lineTo(pa.x, pa.y);
        }

        graphics.closePath();
        graphics.strokePath();
    },

    project: function (graphics, local, coord, transMat)
    {
        var w = graphics.viewportWidth;
        var h = graphics.viewportHeight;

        var point = this._tempVec3;

        point.copy(coord);

        point.transformCoordinates(transMat);

        local.x = point.x * w + w / 2 >> 0;
        local.y = -point.y * h + h / 2 >> 0;
    },

    setPosition: function (x, y, z)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }
        if (z === undefined) { z = x; }

        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        return this;
    },

    setRotation: function (x, y, z)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }
        if (z === undefined) { z = x; }

        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;

        return this;
    },

    setScale: function (x, y, z)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }
        if (z === undefined) { z = x; }

        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;

        return this;
    },

    setStrokeColor: function (color)
    {
        this.strokeColor = color;

        return this;
    },

    setStrokeAlpha: function (alpha)
    {
        this.strokeAlpha = alpha;

        return this;
    },

    setFillColor: function (color)
    {
        this.fillColor = color;

        return this;
    },

    setFillAlpha: function (alpha)
    {
        this.fillAlpha = alpha;

        return this;
    },

    lineStyle: function (lineWidth, color, alpha)
    {
        this.thickness = lineWidth;
        this.strokeColor = color;
        this.strokeAlpha = alpha;

        return this;
    },

    fillStyle: function (color, alpha)
    {
        this.fillColor = color;
        this.fillAlpha = alpha;

        return this;
    },

    setVisible: function (value)
    {
        this.visible = value;

        return this;
    },

    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
        }

    }

});

module.exports = Mesh;
