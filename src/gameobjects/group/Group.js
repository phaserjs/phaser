/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Actions = require('../../actions/');
var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var Range = require('../../utils/array/Range');
var Set = require('../../structs/Set');
var Sprite = require('../sprite/Sprite');

/**
 * @callback GroupCallback
 *
 * @param {Phaser.GameObjects.GameObject} item - [description]
 */

/**
 * @callback GroupMultipleCreateCallback
 *
 * @param {Phaser.GameObjects.GameObject[]} items - [description]
 */

/**
 * @typedef {object} GroupConfig
 *
 * @property {object} [classType=Sprite] - [description]
 * @property {boolean} [active=true] - [description]
 * @property {number} [maxSize=-1] - [description]
 * @property {?string} [defaultKey=null] - [description]
 * @property {?(string|integer)} [defaultFrame=null] - [description]
 * @property {boolean} [runChildUpdate=false] - [description]
 * @property {?GroupCallback} [createCallback=null] - [description]
 * @property {?GroupCallback} [removeCallback=null] - [description]
 * @property {?GroupMultipleCreateCallback} [createMultipleCallback=null] - [description]
 */

/**
 * @typedef {object} GroupCreateConfig
 *
 * @property {object} [classType] - [description]
 * @property {string} [key] - [description]
 * @property {?(string|integer)} [frame=null] - [description]
 * @property {boolean} [visible=true] - [description]
 * @property {boolean} [active=true] - [description]
 * @property {number} [repeat=0] - [description]
 * @property {boolean} [randomKey=false] - [description]
 * @property {boolean} [randomFrame=false] - [description]
 * @property {boolean} [yoyo=false] - [description]
 * @property {number} [frameQuantity=1] - [description]
 * @property {number} [max=1] - [description]
 * @property {object} [setXY] - [description]
 * @property {number} [setXY.x=0] - [description]
 * @property {number} [setXY.y=0] - [description]
 * @property {number} [setXY.stepX=0] - [description]
 * @property {number} [setXY.stepY=0] - [description]
 * @property {object} [setRotation] - [description]
 * @property {number} [setRotation.value=0] - [description]
 * @property {number} [setRotation.step=0] - [description]
 * @property {object} [setScale] - [description]
 * @property {number} [setScale.x=0] - [description]
 * @property {number} [setScale.y=0] - [description]
 * @property {number} [setScale.stepX=0] - [description]
 * @property {number} [setScale.stepY=0] - [description]
 * @property {object} [setAlpha] - [description]
 * @property {number} [setAlpha.value=0] - [description]
 * @property {number} [setAlpha.step=0] - [description]
 * @property {*} [hitArea] - [description]
 * @property {HitAreaCallback} [hitAreaCallback] - [description]
 * @property {(false|GridAlignConfig)} [gridAlign=false] - [description]
 */

/**
 * @classdesc
 * [description]
 *
 *  children can be either an array of children, or a config object
 *  config can be either a config object, or undefined if passed as the children argument instead
 *
 * @class Group
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {array} children - [description]
 * @param {GroupConfig} config - [description]
 */
var Group = new Class({

    initialize:

    function Group (scene, children, config)
    {
        if (config === undefined && !Array.isArray(children) && typeof children === 'object')
        {
            config = children;
            children = null;
        }

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#children
         * @type {Phaser.Structs.Set}
         * @since 3.0.0
         */
        this.children = new Set(children);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#isParent
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.isParent = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#classType
         * @type {object}
         * @since 3.0.0
         */
        this.classType = GetFastValue(config, 'classType', Sprite);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#active
         * @type {boolean}
         * @since 3.0.0
         */
        this.active = GetFastValue(config, 'active', true);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#maxSize
         * @type {integer}
         * @since 3.0.0
         */
        this.maxSize = GetFastValue(config, 'maxSize', -1);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#defaultKey
         * @type {string}
         * @since 3.0.0
         */
        this.defaultKey = GetFastValue(config, 'defaultKey', null);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#defaultFrame
         * @type {(string|integer)}
         * @since 3.0.0
         */
        this.defaultFrame = GetFastValue(config, 'defaultFrame', null);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#runChildUpdate
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.runChildUpdate = GetFastValue(config, 'runChildUpdate', false);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#createCallback
         * @type {?GroupCallback}
         * @since 3.0.0
         */
        this.createCallback = GetFastValue(config, 'createCallback', null);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#removeCallback
         * @type {?GroupCallback}
         * @since 3.0.0
         */
        this.removeCallback = GetFastValue(config, 'removeCallback', null);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Group#createMultipleCallback
         * @type {?GroupMultipleCreateCallback}
         * @since 3.0.0
         */
        this.createMultipleCallback = GetFastValue(config, 'createMultipleCallback', null);

        if (config)
        {
            this.createMultiple(config);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#create
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of this Game Object.
     * @param {boolean} [active=true] - The {@link Phaser.GameObjects.GameObject#active} state of this Game Object.
     *
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    create: function (x, y, key, frame, visible, active)
    {
        if (key === undefined) { key = this.defaultKey; }
        if (frame === undefined) { frame = this.defaultFrame; }
        if (visible === undefined) { visible = true; }
        if (active === undefined) { active = true; }

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
        child.setActive(active);

        this.add(child);

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#createMultiple
     * @since 3.0.0
     *
     * @param {GroupCreateConfig} config - [description]
     *
     * @return {Phaser.GameObjects.GameObject[]} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#createFromConfig
     * @since 3.0.0
     *
     * @param {GroupCreateConfig} options - [description]
     *
     * @return {Phaser.GameObjects.GameObject[]} [description]
     */
    createFromConfig: function (options)
    {
        this.classType = GetFastValue(options, 'classType', this.classType);

        var key = GetFastValue(options, 'key', undefined);
        var frame = GetFastValue(options, 'frame', null);
        var visible = GetFastValue(options, 'visible', true);
        var active = GetFastValue(options, 'active', true);

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
            entries.push(this.create(0, 0, range[c].a, range[c].b, visible, active));
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

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#preUpdate
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#add
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     * @param {boolean} [addToScene=false] - [description]
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    add: function (child, addToScene)
    {
        if (addToScene === undefined) { addToScene = false; }

        this.children.set(child);

        if (this.createCallback)
        {
            this.createCallback.call(this, child);
        }

        if (addToScene)
        {
            this.scene.sys.displayList.add(child);

            if (child.preUpdate)
            {
                this.scene.sys.updateList.add(child);
            }
        }

        child.on('destroy', this.remove, this);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#addMultiple
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject[]} children - [description]
     * @param {boolean} [addToScene=false] - [description]
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    addMultiple: function (children, addToScene)
    {
        if (addToScene === undefined) { addToScene = false; }

        if (Array.isArray(children))
        {
            for (var i = 0; i < children.length; i++)
            {
                this.add(children[i], addToScene);
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#remove
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     * @param {boolean} [removeFromScene=false] - [description]
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    remove: function (child, removeFromScene)
    {
        if (removeFromScene === undefined) { removeFromScene = false; }

        this.children.delete(child);

        if (this.removeCallback)
        {
            this.removeCallback.call(this, child);
        }

        if (removeFromScene)
        {
            this.scene.sys.displayList.remove(child);

            if (child.preUpdate)
            {
                this.scene.sys.updateList.remove(child);
            }
        }

        child.off('destroy', this.remove, this);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#clear
     * @since 3.0.0
     *
     * @param {boolean} [removeFromScene=false] - [description]
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    clear: function (removeFromScene)
    {
        if (removeFromScene === undefined) { removeFromScene = false; }

        var children = this.children;

        for (var i = 0; i < children.size; i++)
        {
            var gameObject = children.entries[i];

            gameObject.off('destroy', this.remove, this);

            if (removeFromScene)
            {
                this.scene.sys.displayList.remove(gameObject);

                if (gameObject.preUpdate)
                {
                    this.scene.sys.updateList.remove(gameObject);
                }
            }
        }

        this.children.clear();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#contains
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     *
     * @return {boolean} [description]
     */
    contains: function (child)
    {
        return this.children.contains(child);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#getChildren
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject[]} [description]
     */
    getChildren: function ()
    {
        return this.children.entries;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#getLength
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    getLength: function ()
    {
        return this.children.size;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#getFirst
     * @since 3.0.0
     *
     * @param {boolean} [state=false] - [description]
     * @param {boolean} [createIfNull=false] - [description]
     * @param {number} [x] - The horizontal position of this Game Object in the world.
     * @param {number} [y] - The vertical position of this Game Object in the world.
     * @param {string} [texture] - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {boolean} [visible] - [description]
     *
     * @return {?Phaser.GameObjects.GameObject} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#get
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {boolean} visible - [description]
     *
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    get: function (x, y, key, frame, visible)
    {
        return this.getFirst(false, true, x, y, key, frame, visible);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#getFirstAlive
     * @since 3.0.0
     *
     * @param {boolean} createIfNull - [description]
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {boolean} visible - [description]
     *
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    getFirstAlive: function (createIfNull, x, y, key, frame, visible)
    {
        return this.getFirst(true, createIfNull, x, y, key, frame, visible);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#getFirstDead
     * @since 3.0.0
     *
     * @param {boolean} createIfNull - [description]
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {boolean} visible - [description]
     *
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    getFirstDead: function (createIfNull, x, y, key, frame, visible)
    {
        return this.getFirst(false, createIfNull, x, y, key, frame, visible);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#playAnimation
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {string} startFrame - [description]
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    playAnimation: function (key, startFrame)
    {
        Actions.PlayAnimation(this.children.entries, key, startFrame);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#isFull
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#countActive
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - [description]
     *
     * @return {integer} [description]
     */
    countActive: function (value)
    {
        if (value === undefined) { value = true; }

        var total = 0;

        for (var i = 0; i < this.children.size; i++)
        {
            if (this.children.entries[i].active === value)
            {
                total++;
            }
        }

        return total;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#getTotalUsed
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    getTotalUsed: function ()
    {
        return this.countActive();
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#getTotalFree
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    getTotalFree: function ()
    {
        var used = this.getTotalUsed();
        var capacity = (this.maxSize === -1) ? 999999999999 : this.maxSize;

        return (capacity - used);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#setDepth
     * @since 3.0.0
     *
     * @param {number} value - [description]
     * @param {number} step - [description]
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    setDepth: function (value, step)
    {
        Actions.SetDepth(this.children.entries, value, step);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#kill
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     */
    kill: function (gameObject)
    {
        if (this.children.contains(gameObject))
        {
            gameObject.setActive(false);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#killAndHide
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     */
    killAndHide: function (gameObject)
    {
        if (this.children.contains(gameObject))
        {
            gameObject.setActive(false);
            gameObject.setVisible(false);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#toggleVisible
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    toggleVisible: function ()
    {
        Actions.ToggleVisible(this.children.entries);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Group#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.children.clear();

        this.scene = undefined;
        this.children = undefined;
    }

});

module.exports = Group;
