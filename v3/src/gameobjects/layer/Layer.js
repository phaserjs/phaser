
var Class = require('../../utils/Class');
var Set = require('../../structs/Set');
var Actions = require('./actions/');
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
    createMultiple: function (quantity, key, frame, visible)
    {
        if (frame === undefined) { frame = null; }
        if (visible === undefined) { visible = true; }

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

    align: Actions.Align,
    angle: Actions.Angle,
    incX: Actions.IncX,
    incXY: Actions.IncXY,
    incY: Actions.IncY,
    positionAroundCircle: Actions.PositionAroundCircle,
    rotate: Actions.Rotate,
    rotateAround: Actions.RotateAround,
    rotateAroundDistance: Actions.RotateAroundDistance,
    setRotation: Actions.SetRotation,
    setVisible: Actions.SetVisible,
    setX: Actions.SetX,
    setXY: Actions.SetXY,
    setY: Actions.SetY,
    toggleVisible: Actions.ToggleVisible


});

module.exports = Layer;
