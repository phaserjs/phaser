var Class = require('../../utils/Class');
var Matrix4 = require('../../math/Matrix4');
var Vector2 = require('../../math/Vector2');
var Vector3 = require('../../math/Vector3');

var Mesh = new Class({

    initialize:

    function Mesh (data, x, y, z)
    {
        //  May contain multiple models
        this.data = data;
        this.vertices = data.vertices;

        this.position = new Vector3(x, y, z);
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);

        this.visible = true;

        this.thickness = 1;
        this.strokeColor = 0x00ff00;
        this.strokeAlpha = 1;

        this.fillColor = 0x00ff00;
        this.fillAlpha = 1;

        this.backfaceCull = true;

        this.points = [];

        this._tempVec3 = new Vector3();

        this.worldMatrix = new Matrix4();

        this.createPoints();
    },

    createPoints: function ()
    {
        var points = this.points;

        for (var i = 0; i < this.data.maxVertices; i++)
        {
            points.push(new Vector2());
        }
    },

    fill: function (graphics)
    {
        if (!this.visible || this.alpha === 0)
        {
            return;
        }

        this.worldMatrix.setWorldMatrix(this.rotation, this.position, this.scale, graphics.viewMatrix, graphics.projectionMatrix);

        graphics.fillStyle(this.fillColor, this.fillAlpha);

        for (var m = 0; m < this.data.models.length; m++)
        {
            var model = this.data.models[m];

            for (var f = 0; f < model.faces.length; f++)
            {
                var face = model.faces[f];

                if (face.type === 0)
                {
                    this.fillTriangle(graphics, face);
                }
                else
                {
                    this.fillPoly(graphics, face);
                }
            }
        }

    },

    fillTriangle: function (graphics, face)
    {
        var a = this.points[0];
        var b = this.points[1];
        var c = this.points[2];

        var verts = this.vertices;
        var world = this.worldMatrix;

        this.project(graphics, a, verts[face.vertices[0].vertexIndex], world);
        this.project(graphics, b, verts[face.vertices[1].vertexIndex], world);
        this.project(graphics, c, verts[face.vertices[2].vertexIndex], world);

        if (this.backfaceCull && !this.isBackFacing(a, b, c))
        {
            graphics.fillTriangle(a.x, a.y, b.x, b.y, c.x, c.y);
        }
    },

    fillPoly: function (graphics, face)
    {
        var points = this.points;
        var verts = this.vertices;
        var world = this.worldMatrix;

        var size = face.vertices.length;

        //  Project
        for (var i = 0; i < size; i++)
        {
            this.project(graphics, points[i], verts[face.vertices[i].vertexIndex], world);
        }

        graphics.fillPoints(points, true, size);
    },

    stroke: function (graphics)
    {
        if (!this.visible || this.alpha === 0)
        {
            return;
        }

        this.worldMatrix.setWorldMatrix(this.rotation, this.position, this.scale, graphics.viewMatrix, graphics.projectionMatrix);

        graphics.lineStyle(this.thickness, this.strokeColor, this.strokeAlpha);

        for (var m = 0; m < this.data.models.length; m++)
        {
            var model = this.data.models[m];

            for (var f = 0; f < model.faces.length; f++)
            {
                var face = model.faces[f];

                if (face.type === 0)
                {
                    this.strokeTriangle(graphics, face);
                }
                else
                {
                    this.strokePoly(graphics, face);
                }
            }
        }
    },

    strokeTriangle: function (graphics, face)
    {
        var a = this.points[0];
        var b = this.points[1];
        var c = this.points[2];

        var verts = this.vertices;
        var world = this.worldMatrix;

        this.project(graphics, a, verts[face.vertices[0].vertexIndex], world);
        this.project(graphics, b, verts[face.vertices[1].vertexIndex], world);
        this.project(graphics, c, verts[face.vertices[2].vertexIndex], world);

        if (this.backfaceCull && !this.isBackFacing(a, b, c))
        {
            graphics.strokeTriangle(a.x, a.y, b.x, b.y, c.x, c.y);
        }
    },

    strokePoly: function (graphics, face)
    {
        var points = this.points;
        var verts = this.vertices;
        var world = this.worldMatrix;

        var size = face.vertices.length;

        //  Project
        for (var i = 0; i < size; i++)
        {
            this.project(graphics, points[i], verts[face.vertices[i].vertexIndex], world);
        }

        graphics.strokePoints(points, true, size);
    },

    //  local is a Vec2 that is changed in place (so not returned)
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

    isBackFacing: function (a, b, c)
    {
        var ax = c.x - a.x;
        var ay = c.y - a.y;

        var bx = b.x - c.x;
        var by = b.y - c.y;

        var result = ax * by - ay * bx;

        return (result >= 0);
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
