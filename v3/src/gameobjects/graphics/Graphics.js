var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./GraphicsRender');

/* This is specific to Graphics internal */
var GraphicsPointPool = [];
var GraphicsPathPool = [];
var MakeGraphicsPoint = function (x, y) 
{
    var point;
    if (GraphicsPointPool.length > 0) 
    {
        point = GraphicsPointPool.pop();
        point.x = x;
        point.y = y;
    }
    else
    {
        point = new GraphicsPoint(x, y);
    }
    return point;
};
var MakeGraphicsPath = function (x, y, color) {
    var path;
    if (GraphicsPathPool.length > 0) 
    {
        path = GraphicsPathPool.pop();
        path.points.length = 0;
        path.points.push({x: x, y: y});
    }
    else
    {
        path = new GraphicsPath(x, y);
    }
    path.color = color;
    return path;
};
var RecycleGraphicsPoint = function (point) {
    var index = GraphicsPointPool.indexOf(point);
    if (index < 0)
    {
        GraphicsPointPool.push(point);
    }
};
var RecycleGraphicsPath = function (path) {
    var index = GraphicsPathPool.indexOf(path);
    if (index < 0)
    {
        GraphicsPathPool.push(path);
    }
};
var GraphicsPoint = function (x, y) 
{
    this.x = x;
    this.y = y;
};
var GraphicsPath = function (x, y, color) 
{
    this.color = color;
    this.points = [];
    this.points.push(MakeGraphicsPoint(x, y));
};
var lerp = function (norm, min, max) 
{
    return (max - min) * norm + min;
};
var cos = Math.cos;
var sin = Math.sin;
var Graphics = new Class({

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function Graphics (state, x, y)
    {
        GameObject.call(this, state);

        this._lastPath = null;
        this._pathArray = [];
        this._lastColor = 0xFFFFFFFF;

        this.setPosition(x, y);
    },

    arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
        var iteration = 0;
        var iterStep = 0.01;
        var tx = 0;
        var ty = 0;
        var ta = 0;
        var moveTo = this.moveTo;
        var lineTo = this.lineTo;
        while (iteration < 1) {
            ta = lerp(iteration, startAngle, endAngle);
            tx = x + cos(ta) * radius;
            ty = y + sin(ta) * radius;
            if (iteration === 0) {
                moveTo(tx, ty);
            } else {
                lineTo(tx, ty);
            }
            iteration += iterStep;
        }
    },

    beginFill: function (color) {
        this.clear();
        this._lastColor = color;
    },

    endFill: function () {
        var lastPath = this._lastPath;
        if (lastPath !== null && lastPath.point.length > 0) 
        {
            var firstPoint = lastPath.points[0];
            var lastPoint = lastPath.points[lastPath.points.length - 1];
            lastPath.points.push(firstPoint);
            this.moveTo(lastPoint.x, lastPoint.y);
        }
    },

    clear: function () {
        var path; 
        var points;
        var pathArray = this._pathArray;
        var pointIndex = 0;
        for (var pathIndex = 0, pathLength = pathArray.length; pathIndex < pathLength; ++pathIndex) 
        {
            path = pathArray[pathIndex];
            points = path.points;
            RecycleGraphicsPoint(path);
            for (pointIndex = 0, pointsLength = points.length; pointIndex < pointsLength; ++pointIndex)
            {
                RecycleGraphicsPoint(points[pointIndex]);
            }
            points.length = 0;
        }
        pathArray.length = 0;
        this._lastColor = 0xFFFFFFFF;
        this._lastPath = null;
    },

    drawCircle: function (x, y, diameter) {},

    drawPolygon: function (path) {},

    drawRect: function (x, y, width, height) {},

    lineTo: function (x, y) {
        if (this._lastPath !== null) 
        {
            this._lastPath.points.push(MakeGraphicsPath(x, y, this._lastColor));
        }
        else
        {
            this.moveTo(x, y);
        }
    },

    moveTo: function (x, y) {
        this._lastPath = MakeGraphicsPath(x, y, this._lastColor);
        this._pathArray.push(this._lastPath);
    }
});

module.exports = Graphics;
