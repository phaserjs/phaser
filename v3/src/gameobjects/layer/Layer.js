
var Class = require('../../utils/Class');
var Set = require('../../structs/Set');
var GetValue = require('../../utils/object/GetValue');
var Range = require('../../utils/array/Range');
var Actions = require('../../actions/');
var Sprite = require('../sprite/Sprite');

var Layer = new Class({

    initialize:

    function Layer (state, children)
    {
        this.state = state;

        this.children = new Set(children);

        this.classType = Sprite;
    },

    //  Layer management methods:

    add: function (child)
    {
        this.children.set(child);

        return this;
    },

    addMultiple: function (children)
    {
        if (Array.isArray(children))
        {
            for (var i = 0; i < children.length; i++)
            {
                this.children.set(children[i]);
            }
        }

        return this;
    },

    create: function (x, y, key, frame, visible)
    {
        if (visible === undefined) { visible = true; }

        var child = this.state.sys.children.add(new this.classType(this.state, x, y, key, frame));

        child.visible = visible;

        this.add(child);

        return child;
    },

    createFromConfig: function (options)
    {
        var key = GetValue(options, 'key', undefined);
        var frame = GetValue(options, 'frame', null);
        var visible = GetValue(options, 'visible', true);

        var entries = [];

        //  Can't do anything without at least a key
        if (key === undefined)
        {
            return entries;
        }
        else
        {
            if (!Array.isArray(key))
            {
                key = [ key ];
            }

            if (!Array.isArray(frame))
            {
                frame = [ frame ];
            }
        }

        //  Build an array of key frame pairs to loop through

        var repeat = GetValue(options, 'repeat', 0);
        var randomKey = GetValue(options, 'randomKey', false);
        var randomFrame = GetValue(options, 'randomFrame', false);
        var yoyo = GetValue(options, 'yoyo', false);
        var quantity = GetValue(options, 'frameQuantity', 1);
        var max = GetValue(options, 'max', 0);

        var range = Range(key, frame, {
            max: max,
            qty: quantity,
            random: randomKey,
            randomB: randomFrame,
            repeat: repeat,
            yoyo: yoyo
        });

        for (var c = 0; c < range.length; c++)
        {
            entries.push(this.create(0, 0, range[c].a, range[c].b, visible));
        }

        //  Post-creation options (applied only to those items created in this call):

        var x = GetValue(options, 'setXY.x', 0);
        var y = GetValue(options, 'setXY.y', 0);
        var stepX = GetValue(options, 'setXY.stepX', 0);
        var stepY = GetValue(options, 'setXY.stepY', 0);

        Actions.SetXY(entries, x, y, stepX, stepY);

        var rotation = GetValue(options, 'setRotation.value', 0);
        var stepRotation = GetValue(options, 'setRotation.step', 0);

        Actions.SetRotation(entries, rotation, stepRotation);

        var scaleX = GetValue(options, 'setScale.x', 1);
        var scaleY = GetValue(options, 'setScale.y', scaleX);
        var stepScaleX = GetValue(options, 'setScale.stepX', 0);
        var stepScaleY = GetValue(options, 'setScale.stepY', 0);

        Actions.SetScale(entries, scaleX, scaleY, stepScaleX, stepScaleY);

        var alpha = GetValue(options, 'setAlpha.value', 1);
        var stepAlpha = GetValue(options, 'setAlpha.step', 0);

        Actions.SetAlpha(entries, alpha, stepAlpha);

        return entries;
    },

    createMultiple: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var output = [];

        for (var i = 0; i < config.length; i++)
        {
            var entries = this.createFromConfig(config[i]);

            output = output.concat(entries);
        }

        return output;
    },

    remove: function (child)
    {
        this.children.delete(child);

        return this;
    },

    clear: function ()
    {
        this.children.clear();

        return this;
    },

    getChildren: function ()
    {
        return this.children.entries;
    },

    destroy: function ()
    {
        this.children.clear();

        this.state = undefined;
        this.children = undefined;
    },

    //  Child related methods

    angle: function (value)
    {
        Actions.Angle(this.children.entries, value);

        return this;
    },

    gridAlign: function (options)
    {
        Actions.GridAlign(this.children.entries, options);

        return this;
    },

    incAlpha: function (value, step)
    {
        Actions.IncAlpha(this.children.entries, value, step);

        return this;
    },

    incX: function (value)
    {
        Actions.IncX(this.children.entries, value);

        return this;
    },

    incXY: function (x, y)
    {
        Actions.IncXY(this.children.entries, x, y);

        return this;
    },

    incY: function (value)
    {
        Actions.IncY(this.children.entries, value);

        return this;
    },

    placeOnCircle: function (circle, startAngle, endAngle)
    {
        Actions.PlaceOnCircle(this.children.entries, circle, startAngle, endAngle);

        return this;
    },

    placeOnLine: function (line)
    {
        Actions.PlaceOnLine(this.children.entries, line);

        return this;
    },

    placeOnRectangle: function (rect, shift)
    {
        Actions.PlaceOnRectangle(this.children.entries, rect, shift);

        return this;
    },

    placeOnTriangle: function (triangle, stepRate)
    {
        Actions.PlaceOnTriangle(this.children.entries, triangle, stepRate);

        return this;
    },

    playAnimation: function (key, startFrame)
    {
        Actions.PlayAnimation(this.children.entries, key, startFrame);

        return this;
    },

    randomCircle: function (circle)
    {
        Actions.RandomCircle(this.children.entries, circle);

        return this;
    },

    randomEllipse: function (ellipse)
    {
        Actions.RandomEllipse(this.children.entries, ellipse);

        return this;
    },

    randomLine: function (line)
    {
        Actions.RandomLine(this.children.entries, line);

        return this;
    },

    randomRectangle: function (rect)
    {
        Actions.RandomRectangle(this.children.entries, rect);

        return this;
    },

    randomTriangle: function (triangle)
    {
        Actions.RandomTriangle(this.children.entries, triangle);

        return this;
    },

    rotate: function (value, step)
    {
        Actions.Rotate(this.children.entries, value, step);

        return this;
    },

    rotateAround: function (point, angle)
    {
        Actions.RotateAround(this.children.entries, point, angle);

        return this;
    },

    rotateAroundDistance: function (point, angle, distance)
    {
        Actions.RotateAroundDistance(this.children.entries, point, angle, distance);

        return this;
    },

    setAlpha: function (value, step)
    {
        Actions.SetAlpha(this.children.entries, value, step);

        return this;
    },

    setOrigin: function (x, y)
    {
        Actions.SetOrigin(this.children.entries, x, y);

        return this;
    },

    scaleX: function (value)
    {
        Actions.ScaleX(this.children.entries, value);

        return this;
    },

    scaleXY: function (x, y)
    {
        Actions.ScaleXY(this.children.entries, x, y);

        return this;
    },

    scaleY: function (value)
    {
        Actions.ScaleY(this.children.entries, value);

        return this;
    },

    setRotation: function (value, step)
    {
        Actions.SetRotation(this.children.entries, value, step);

        return this;
    },

    setScale: function (x, y, stepX, stepY)
    {
        Actions.SetScale(this.children.entries, x, y, stepX, stepY);

        return this;
    },

    setScaleX: function (value, step)
    {
        Actions.SetScaleX(this.children.entries, value, step);

        return this;
    },

    setScaleY: function (value, step)
    {
        Actions.SetScaleY(this.children.entries, value, step);

        return this;
    },

    setVisible: function (value)
    {
        Actions.SetVisible(this.children.entries, value);

        return this;
    },

    setX: function (value, step)
    {
        Actions.SetX(this.children.entries, value, step);

        return this;
    },

    setXY: function (x, y, stepX, stepY)
    {
        Actions.SetXY(this.children.entries, x, y, stepX, stepY);

        return this;
    },

    setY: function (value, step)
    {
        Actions.SetY(this.children.entries, value, step);

        return this;
    },

    smootherStep: function (property, min, max, inc)
    {
        Actions.SmootherStep(this.children.entries, property, min, max, inc);

        return this;
    },

    smoothStep: function (property, min, max, inc)
    {
        Actions.SmoothStep(this.children.entries, property, min, max, inc);

        return this;
    },

    spread: function (property, min, max, inc)
    {
        Actions.Spread(this.children.entries, property, min, max, inc);

        return this;
    },

    toggleVisible: function ()
    {
        Actions.ToggleVisible(this.children.entries);

        return this;
    }

});

module.exports = Layer;
