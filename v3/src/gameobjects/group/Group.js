var Actions = require('../../actions/');
var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var Range = require('../../utils/array/Range');
var Set = require('../../structs/Set');
var Sprite = require('../sprite/Sprite');

var Group = new Class({

    initialize:

    //  children can be either an array of children, or a config object
    //  config can be either a config object, or undefined if passed as the children argument instead
    function Group (scene, children, config)
    {
        if (config === undefined && !Array.isArray(children) && typeof children === 'object')
        {
            config = children;
            children = null;
        }

        this.scene = scene;

        this.children = new Set(children);

        this.isParent = true;

        this.classType = GetFastValue(config, 'classType', Sprite);

        this.active = GetFastValue(config, 'active', true);
        
        this.maxSize = GetFastValue(config, 'maxSize', -1);

        this.defaultKey = GetFastValue(config, 'defaultKey', null);
        this.defaultFrame = GetFastValue(config, 'defaultFrame', null);
        this.runChildUpdate = GetFastValue(config, 'runChildUpdate', false);

        this.createCallback = GetFastValue(config, 'createCallback', null);
        this.removeCallback = GetFastValue(config, 'removeCallback', null);
        this.createMultipleCallback = GetFastValue(config, 'createMultipleCallback', null);

        if (config)
        {
            this.createMultiple(config);
        }
    },

    create: function (x, y, key, frame, visible)
    {
        if (key === undefined) { key = this.defaultKey; }
        if (frame === undefined) { frame = this.defaultFrame; }
        if (visible === undefined) { visible = true; }

        //  Pool?
        if (this.isFull())
        {
            return null;
        }

        var child = new this.classType(this.scene, x, y, key, frame);

        this.scene.sys.displayList.add(child);

        if (child.preUpdate)
        {
            this.scene.sys.updateList.add(child);
        }

        child.visible = visible;

        this.add(child);

        return child;
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

    createFromConfig: function (options)
    {
        this.classType = GetFastValue(options, 'classType', this.classType);

        var key = GetFastValue(options, 'key', undefined);
        var frame = GetFastValue(options, 'frame', null);
        var visible = GetFastValue(options, 'visible', true);

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

        var repeat = GetFastValue(options, 'repeat', 0);
        var randomKey = GetFastValue(options, 'randomKey', false);
        var randomFrame = GetFastValue(options, 'randomFrame', false);
        var yoyo = GetFastValue(options, 'yoyo', false);
        var quantity = GetFastValue(options, 'frameQuantity', 1);
        var max = GetFastValue(options, 'max', 0);

        //  If a grid is set we use that to override the quantity?

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

        var hitArea = GetFastValue(options, 'hitArea', null);
        var hitAreaCallback = GetFastValue(options, 'hitAreaCallback', null);

        if (hitArea)
        {
            Actions.SetHitArea(entries, hitArea, hitAreaCallback);
        }

        var grid = GetFastValue(options, 'gridAlign', false);

        if (grid)
        {
            Actions.GridAlign(entries, grid);
        }

        if (this.createMultipleCallback)
        {
            this.createMultipleCallback.call(this, entries);
        }

        return entries;
    },

    preUpdate: function (time, delta)
    {
        if (!this.runChildUpdate || this.children.size === 0)
        {
            return;
        }

        //  Because a Group child may mess with the length of the Group during its update
        var temp = this.children.entries.slice();

        for (var i = 0; i < temp.length; i++)
        {
            var item = temp[i];

            if (item.active)
            {
                item.update(time, delta);
            }
        }
    },

    add: function (child)
    {
        this.children.set(child);

        if (this.createCallback)
        {
            this.createCallback.call(this, child);
        }

        return this;
    },

    addMultiple: function (children)
    {
        if (Array.isArray(children))
        {
            for (var i = 0; i < children.length; i++)
            {
                this.add(children[i]);
            }
        }

        return this;
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

    contains: function (child)
    {
        return this.children.contains(child);
    },

    getChildren: function ()
    {
        return this.children.entries;
    },

    getLength: function ()
    {
        return this.children.size;
    },

    getFirst: function (state, createIfNull, x, y, key, frame, visible)
    {
        if (state === undefined) { state = false; }
        if (createIfNull === undefined) { createIfNull = false; }

        var gameObject;

        var children = this.children.entries;

        for (var i = 0; i < children.length; i++)
        {
            gameObject = children[i];

            if (gameObject.active === state)
            {
                if (typeof(x) === 'number')
                {
                    gameObject.x = x;
                }

                if (typeof(y) === 'number')
                {
                    gameObject.y = y;
                }

                return gameObject;
            }
        }

        //  Got this far? We need to create or bail
        if (createIfNull)
        {
            return this.create(x, y, key, frame, visible);
        }
        else
        {
            return null;
        }
    },

    get: function (x, y, key, frame, visible)
    {
        return this.getFirst(false, true, x, y, key, frame, visible);
    },

    getFirstAlive: function (createIfNull, x, y, key, frame, visible)
    {
        return this.getFirst(true, createIfNull, x, y, key, frame, visible);
    },

    getFirstDead: function (createIfNull, x, y, key, frame, visible)
    {
        return this.getFirst(false, createIfNull, x, y, key, frame, visible);
    },

    playAnimation: function (key, startFrame)
    {
        Actions.PlayAnimation(this.children.entries, key, startFrame);

        return this;
    },

    isFull: function ()
    {
        if (this.maxSize === -1)
        {
            return false;
        }
        else
        {
            return (this.children.size === this.maxSize);
        }
    },

    getTotalUsed: function ()
    {
        var total = 0;

        for (var i = 0; i < this.children.size; i++)
        {
            if (this.children.entries[i].active)
            {
                total++;
            }
        }

        return total;
    },

    getTotalFree: function ()
    {
        var used = this.getTotalUsed();
        var capacity = (this.maxSize === -1) ? 999999999999 : this.maxSize;

        return (capacity - used);
    },

    setDepth: function (value, step)
    {
        Actions.SetDepth(this.children.entries, value, step);

        return this;
    },

    kill: function (gameObject)
    {
        if (this.children.contains(gameObject))
        {
            gameObject.setActive(false);
        }
    },

    killAndHide: function (gameObject)
    {
        if (this.children.contains(gameObject))
        {
            gameObject.setActive(false);
            gameObject.setVisible(false);
        }
    },

    toggleVisible: function ()
    {
        Actions.ToggleVisible(this.children.entries);

        return this;
    },

    destroy: function ()
    {
        this.children.clear();

        this.scene = undefined;
        this.children = undefined;
    }

});

module.exports = Group;
