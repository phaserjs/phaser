
var Class = require('../../utils/Class');
var Set = require('../../structs/Set');
var GetObjectValue = require('../../utils/object/GetObjectValue');
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

        var child = this.state.children.add(new this.classType(this.state, x, y, key, frame));

        child.visible = visible;

        return this.add(child);
    },

    /**
    * Creates multiple Phaser.Sprite objects and adds them to the top of this Group.
    * 
    * This method is useful if you need to quickly generate a pool of sprites, such as bullets.
    *
    * Use {@link #classType} to change the type of object created.
    *
    * You can provide an array as the `key` and / or `frame` arguments. When you do this
    * it will create `quantity` Sprites for every key (and frame) in the arrays.
    * 
    * For example:
    * 
    * `createMultiple(25, ['ball', 'carrot'])`
    *
    * In the above code there are 2 keys (ball and carrot) which means that 50 sprites will be
    * created in total, 25 of each. You can also have the `frame` as an array:
    *
    * `createMultiple(5, 'bricks', [0, 1, 2, 3])`
    *
    * In the above there is one key (bricks), which is a sprite sheet. The frames array tells
    * this method to use frames 0, 1, 2 and 3. So in total it will create 20 sprites, because
    * the quantity was set to 5, so that is 5 brick sprites of frame 0, 5 brick sprites with
    * frame 1, and so on.
    *
    * If you set both the key and frame arguments to be arrays then understand it will create
    * a total quantity of sprites equal to the size of both arrays times each other. I.e.:
    *
    * `createMultiple(20, ['diamonds', 'balls'], [0, 1, 2])`
    *
    * The above will create 20 'diamonds' of frame 0, 20 with frame 1 and 20 with frame 2.
    * It will then create 20 'balls' of frame 0, 20 with frame 1 and 20 with frame 2.
    * In total it will have created 120 sprites.
    *
    * By default the Sprites will have their `exists` property set to `false`, and they will be 
    * positioned at 0x0, relative to the `Group.x / y` values.
    * 
    * If `Group.enableBody` is set, then a physics body will be created on the objects, so long as one does not already exist.
    *
    * If `Group.inputEnableChildren` is set, then an Input Handler will be created on the objects, so long as one does not already exist.
    *
    * @method Phaser.Group#createMultiple
    * @param {integer} quantity - The number of Sprites to create.
    * @param {string|array} key - The Cache key of the image that the Sprites will use. Or an Array of keys. See the description for details on how the quantity applies when arrays are used.
    * @param {integer|string|array} [frame=0] - If the Sprite image contains multiple frames you can specify which one to use here. Or an Array of frames. See the description for details on how the quantity applies when arrays are used.
    * @param {boolean} [exists=false] - The default exists state of the Sprite.
    * @return {array} An array containing all of the Sprites that were created.
    */
    createMultiple: function (quantity, key, frame, options)
    {
        if (frame === undefined) { frame = null; }
        // if (options === undefined) { options = {}; }

        var visible = GetObjectValue(options, 'visible', true);

        if (!Array.isArray(key))
        {
            key = [ key ];
        }

        if (!Array.isArray(frame))
        {
            frame = [ frame ];
        }

        var _this = this;
        var entries = [];

        key.forEach(function (singleKey)
        {
            frame.forEach(function (singleFrame)
            {
                for (var i = 0; i < quantity; i++)
                {
                    entries.push(_this.create(0, 0, singleKey, singleFrame, visible));
                }
            });
        });

        //  Post-creation options:

        var x = GetObjectValue(options, 'x', 0);
        var y = GetObjectValue(options, 'y', 0);
        var stepX = GetObjectValue(options, 'stepX', 0);
        var stepY = GetObjectValue(options, 'stepY', 0);

        this.setXY(x, y, stepX, stepY);

        var rotation = GetObjectValue(options, 'rotation', 0);
        var stepRotation = GetObjectValue(options, 'stepRotation', 0);

        this.setRotation(rotation, stepRotation);

        var alpha = GetObjectValue(options, 'alpha', 1);
        var stepAlpha = GetObjectValue(options, 'stepAlpha', 0);

        this.setAlpha(alpha, stepAlpha);

        return entries;
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

    gridAlign: function (width, height, cellWidth, cellHeight, position)
    {
        Actions.GridAlign(this.children.entries, width, height, cellWidth, cellHeight, position);

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

    positionAroundCircle: function (circle, startAngle, endAngle)
    {
        Actions.PositionAroundCircle(this.children.entries, circle, startAngle, endAngle);

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

    rotate: function (value)
    {
        Actions.Rotate(this.children.entries, value);

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

    toggleVisible: function ()
    {
        Actions.ToggleVisible(this.children.entries);

        return this;
    }

});

module.exports = Layer;
