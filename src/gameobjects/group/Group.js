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
 * @param {Phaser.GameObjects.GameObject} item - A group member
 */

/**
 * @callback GroupMultipleCreateCallback
 *
 * @param {Phaser.GameObjects.GameObject[]} items - The newly created group members
 */

/**
 * @typedef {object} GroupConfig
 *
 * @property {?object} [classType=Sprite] - Sets {@link Phaser.GameObjects.Group#classType}.
 * @property {?boolean} [active=true] - Sets {@link Phaser.GameObjects.Group#active}.
 * @property {?number} [maxSize=-1] - Sets {@link Phaser.GameObjects.Group#maxSize}.
 * @property {?string} [defaultKey=null] - Sets {@link Phaser.GameObjects.Group#defaultKey}.
 * @property {?(string|integer)} [defaultFrame=null] - Sets {@link Phaser.GameObjects.Group#defaultFrame}.
 * @property {?boolean} [runChildUpdate=false] - Sets {@link Phaser.GameObjects.Group#runChildUpdate}.
 * @property {?GroupCallback} [createCallback=null] - Sets {@link Phaser.GameObjects.Group#createCallback}.
 * @property {?GroupCallback} [removeCallback=null] - Sets {@link Phaser.GameObjects.Group#removeCallback}.
 * @property {?GroupMultipleCreateCallback} [createMultipleCallback=null] - Sets {@link Phaser.GameObjects.Group#createMultipleCallback}.
 */

/**
 * @typedef {object} GroupCreateConfig
 *
 * The total number of objects created will be
 *
 *     key.length * frame.length * frameQuantity * (yoyo ? 2 : 1) * (1 + repeat)
 *
 * In the simplest case, 1 + `repeat` objects will be created.
 *
 * If `max` is positive, then the total created will not exceed `max`.
 *
 * `key` is required. {@link Phaser.GameObjects.Group#defaultKey} is not used.
 *
 * @property {?object} [classType] - The class of each new Game Object.
 * @property {string} [key] - The texture key of each new Game Object.
 * @property {?(string|integer)} [frame=null] - The texture frame of each new Game Object.
 * @property {?boolean} [visible=true] - The visible state of each new Game Object.
 * @property {?boolean} [active=true] - The active state of each new Game Object.
 * @property {?number} [repeat=0] - The number of times each `key` × `frame` combination will be *repeated* (after the first combination).
 * @property {?boolean} [randomKey=false] - Select a `key` at random.
 * @property {?boolean} [randomFrame=false] - Select a `frame` at random.
 * @property {?boolean} [yoyo=false] - Select keys and frames by moving forward then backward through `key` and `frame`.
 * @property {?number} [frameQuantity=1] - The number of times each `frame` should be combined with one `key`.
 * @property {?number} [max=0] - The maximum number of new Game Objects to create. 0 is no maximum.
 * @property {?object} [setXY]
 * @property {?number} [setXY.x=0] - The horizontal position of each new Game Object.
 * @property {?number} [setXY.y=0] - The vertical position of each new Game Object.
 * @property {?number} [setXY.stepX=0] - Increment each Game Object's horizontal position from the previous by this amount, starting from `setXY.x`.
 * @property {?number} [setXY.stepY=0] - Increment each Game Object's vertical position from the previous by this amount, starting from `setXY.y`.
 * @property {?object} [setRotation]
 * @property {?number} [setRotation.value=0] - Rotation of each new Game Object.
 * @property {?number} [setRotation.step=0] - Increment each Game Object's rotation from the previous by this amount, starting at `setRotation.value`.
 * @property {?object} [setScale]
 * @property {?number} [setScale.x=0] - The horizontal scale of each new Game Object.
 * @property {?number} [setScale.y=0] - The vertical scale of each new Game Object.
 * @property {?number} [setScale.stepX=0] - Increment each Game Object's horizontal scale from the previous by this amount, starting from `setScale.x`.
 * @property {?number} [setScale.stepY=0] - Increment each Game object's vertical scale from the previous by this amount, starting from `setScale.y`.
 * @property {?object} [setAlpha]
 * @property {?number} [setAlpha.value=0] - The alpha value of each new Game Object.
 * @property {?number} [setAlpha.step=0] - Increment each Game Object's alpha from the previous by this amount, starting from `setAlpha.value`.
 * @property {?*} [hitArea] - A geometric shape that defines the hit area for the Game Object.
 * @property {?HitAreaCallback} [hitAreaCallback] - A callback to be invoked when the Game Object is interacted with.
 * @property {?(false|GridAlignConfig)} [gridAlign=false] - Align the new Game Objects in a grid using these settings.
 *
 * @see Phaser.Actions.GridAlign
 * @see Phaser.Actions.SetAlpha
 * @see Phaser.Actions.SetHitArea
 * @see Phaser.Actions.SetRotation
 * @see Phaser.Actions.SetScale
 * @see Phaser.Actions.SetXY
 * @see Phaser.GameObjects.Group#createFromConfig
 * @see Phaser.Utils.Array.Range
 */

/**
 * @classdesc A Group is a way for you to create, manipulate, or recycle similar Game Objects.
 *
 * Group membership is non-exclusive. A Game Object can belong to several groups, one group, or none.
 *
 * Groups themselves aren't displayable, and can't be positioned, rotated, scaled, or hidden.
 *
 * @class Group
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 * @param {Phaser.Scene} scene - The scene this group belongs to.
 * @param {(Phaser.GameObjects.GameObject[]|GroupConfig)} [children] - Game objects to add to this group; or the `config` argument.
 * @param {GroupConfig|GroupCreateConfig} [config] - Settings for this group. If `key` is set, Phaser.GameObjects.Group#createMultiple is also called with these settings.
 *
 * @see Phaser.Physics.Arcade.Group
 * @see Phaser.Physics.Arcade.StaticGroup
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
         * This scene this group belongs to.
         *
         * @name Phaser.GameObjects.Group#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * Members of this group.
         *
         * @name Phaser.GameObjects.Group#children
         * @type {Phaser.Structs.Set.<Phaser.GameObjects.GameObject>}
         * @since 3.0.0
         */
        this.children = new Set(children);

        /**
         * A flag identifying this object as a group.
         *
         * @name Phaser.GameObjects.Group#isParent
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.isParent = true;

        /**
         * The class to create new group members from.
         *
         * @name Phaser.GameObjects.Group#classType
         * @type {object}
         * @since 3.0.0
         * @default Phaser.GameObjects.Sprite
         */
        this.classType = GetFastValue(config, 'classType', Sprite);

        /**
         * Whether this group runs its {@link Phaser.GameObjects.Group#preUpdate} method
         * (which may update any members).
         *
         * @name Phaser.GameObjects.Group#active
         * @type {boolean}
         * @since 3.0.0
         */
        this.active = GetFastValue(config, 'active', true);

        /**
         * The maximum size of this group, if used as a pool. -1 is no limit.
         *
         * @name Phaser.GameObjects.Group#maxSize
         * @type {integer}
         * @since 3.0.0
         * @default -1
         */
        this.maxSize = GetFastValue(config, 'maxSize', -1);

        /**
         * A default texture key to use when creating new group members.
         *
         * This is used in {@link Phaser.GameObjects.Group#create}
         * but not in {@link Phaser.GameObjects.Group#createMultiple}.
         *
         * @name Phaser.GameObjects.Group#defaultKey
         * @type {string}
         * @since 3.0.0
         */
        this.defaultKey = GetFastValue(config, 'defaultKey', null);

        /**
         * A default texture frame to use when creating new group members.
         *
         * @name Phaser.GameObjects.Group#defaultFrame
         * @type {(string|integer)}
         * @since 3.0.0
         */
        this.defaultFrame = GetFastValue(config, 'defaultFrame', null);

        /**
         * Whether to call the update method of any members.
         *
         * @name Phaser.GameObjects.Group#runChildUpdate
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.GameObjects.Group#preUpdate
         */
        this.runChildUpdate = GetFastValue(config, 'runChildUpdate', false);

        /**
         * A function to be called when adding or creating group members.
         *
         * @name Phaser.GameObjects.Group#createCallback
         * @type {?GroupCallback}
         * @since 3.0.0
         */
        this.createCallback = GetFastValue(config, 'createCallback', null);

        /**
         * A function to be called when removing group members.
         *
         * @name Phaser.GameObjects.Group#removeCallback
         * @type {?GroupCallback}
         * @since 3.0.0
         */
        this.removeCallback = GetFastValue(config, 'removeCallback', null);

        /**
         * A function to be called when creating several group members at once.
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
     * Creates a new Game Object and adds it to this group, unless the group {@link Phaser.GameObjects.Group#isFull is full}.
     *
     * Calls {@link Phaser.GameObjects.Group#createCallback}.
     *
     * @method Phaser.GameObjects.Group#create
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal position of the new Game Object in the world.
     * @param {number} [y=0] - The vertical position of the new Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key of the new Game Object.
     * @param {(string|integer)} [frame=defaultFrame] - The texture frame of the new Game Object.
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of the new Game Object.
     * @param {boolean} [active=true] - The {@link Phaser.GameObjects.GameObject#active} state of the new Game Object.
     *
     * @return {Phaser.GameObjects.GameObject} The new Game Object.
     */
    create: function (x, y, key, frame, visible, active)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
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
     * Creates several Game Objects and adds them to this group.
     *
     * If the group becomes {@link Phaser.GameObjects.Group#isFull}, no further Game Objects are created.
     *
     * Calls {@link Phaser.GameObjects.Group#createMultipleCallback} and {@link Phaser.GameObjects.Group#createCallback}.
     *
     * @method Phaser.GameObjects.Group#createMultiple
     * @since 3.0.0
     *
     * @param {GroupCreateConfig|GroupCreateConfig[]} config - Creation settings. This can be a single configuration object or an array of such objects, which will be applied in turn.
     *
     * @return {Phaser.GameObjects.GameObject[]} The newly created Game Objects.
     */
    createMultiple: function (config)
    {
        if (this.isFull())
        {
            return [];
        }

        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        if (config[0].key === undefined)
        {
            return [];
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
     * A helper for {@link Phaser.GameObjects.Group#createMultiple}.
     *
     * @method Phaser.GameObjects.Group#createFromConfig
     * @since 3.0.0
     *
     * @param {GroupCreateConfig} options - Creation settings.
     *
     * @return {Phaser.GameObjects.GameObject[]} The newly created Game Objects.
     */
    createFromConfig: function (options)
    {
        if (this.isFull())
        {
            return [];
        }

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
            var created = this.create(0, 0, range[c].a, range[c].b, visible, active);

            if (!created)
            {
                break;
            }

            entries.push(created);
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
     * Updates any group members, if {@link Phaser.GameObjects.Group#runChildUpdate} is enabled.
     *
     * @method Phaser.GameObjects.Group#preUpdate
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time elapsed since the last frame.
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
     * Adds a Game Object to this group.
     *
     * Calls {@link Phaser.GameObjects.Group#createCallback}.
     *
     * @method Phaser.GameObjects.Group#add
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to add.
     * @param {boolean} [addToScene=false] - Also add the Game Object to the scene.
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    add: function (child, addToScene)
    {
        if (addToScene === undefined) { addToScene = false; }

        if (this.isFull())
        {
            return this;
        }

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
     * Adds several Game Objects to this group.
     *
     * Calls {@link Phaser.GameObjects.Group#createCallback}.
     *
     * @method Phaser.GameObjects.Group#addMultiple
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject[]} children - The Game Objects to add.
     * @param {boolean} [addToScene=false] - Also add the Game Objects to the scene.
     *
     * @return {Phaser.GameObjects.Group} This group.
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
     * Removes a member of this Group and optionally removes it from the Scene and / or destroys it.
     *
     * Calls {@link Phaser.GameObjects.Group#removeCallback}.
     *
     * @method Phaser.GameObjects.Group#remove
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to remove.
     * @param {boolean} [removeFromScene=false] - Optionally remove the Group member from the Scene it belongs to.
     * @param {boolean} [destroyChild=false] - Optionally call destroy on the removed Group member.
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    remove: function (child, removeFromScene, destroyChild)
    {
        if (removeFromScene === undefined) { removeFromScene = false; }
        if (destroyChild === undefined) { destroyChild = false; }

        if (!this.children.contains(child))
        {
            return this;
        }

        this.children.delete(child);

        if (this.removeCallback)
        {
            this.removeCallback.call(this, child);
        }

        child.off('destroy', this.remove, this);

        if (destroyChild)
        {
            child.destroy();
        }
        else if (removeFromScene)
        {
            child.scene.sys.displayList.remove(child);

            if (child.preUpdate)
            {
                child.scene.sys.updateList.remove(child);
            }
        }

        return this;
    },

    /**
     * Removes all members of this Group and optionally removes them from the Scene and / or destroys them.
     *
     * Does not call {@link Phaser.GameObjects.Group#removeCallback}.
     *
     * @method Phaser.GameObjects.Group#clear
     * @since 3.0.0
     *
     * @param {boolean} [removeFromScene=false] - Optionally remove each Group member from the Scene.
     * @param {boolean} [destroyChild=false] - Optionally call destroy on the removed Group members.
     *
     * @return {Phaser.GameObjects.Group} This group.
     */
    clear: function (removeFromScene, destroyChild)
    {
        if (removeFromScene === undefined) { removeFromScene = false; }
        if (destroyChild === undefined) { destroyChild = false; }

        var children = this.children;

        for (var i = 0; i < children.size; i++)
        {
            var gameObject = children.entries[i];

            gameObject.off('destroy', this.remove, this);

            if (destroyChild)
            {
                gameObject.destroy();
            }
            else if (removeFromScene)
            {
                gameObject.scene.sys.displayList.remove(gameObject);

                if (gameObject.preUpdate)
                {
                    gameObject.scene.sys.updateList.remove(gameObject);
                }
            }
        }

        this.children.clear();

        return this;
    },

    /**
     * Tests if a Game Object is a member of this group.
     *
     * @method Phaser.GameObjects.Group#contains
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - A Game Object.
     *
     * @return {boolean} True if the Game Object is a member of this group.
     */
    contains: function (child)
    {
        return this.children.contains(child);
    },

    /**
     * All members of the group.
     *
     * @method Phaser.GameObjects.Group#getChildren
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject[]} The group members.
     */
    getChildren: function ()
    {
        return this.children.entries;
    },

    /**
     * The number of members of the group.
     *
     * @method Phaser.GameObjects.Group#getLength
     * @since 3.0.0
     *
     * @return {integer}
     */
    getLength: function ()
    {
        return this.children.size;
    },

    /**
     * Scans the Group, from top to bottom, for the first member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
     * assigns `x` and `y`, and returns the member.
     *
     * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
     * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
     *
     * @method Phaser.GameObjects.Group#getFirst
     * @since 3.0.0
     *
     * @param {boolean} [state=false] - The {@link Phaser.GameObjects.GameObject#active} value to match.
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|integer)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?Phaser.GameObjects.GameObject} The first matching group member, or a newly created member, or null.
     */
    getFirst: function (state, createIfNull, x, y, key, frame, visible)
    {
        return this.getHandler(true, 1, state, createIfNull, x, y, key, frame, visible);
    },

    /**
     * Scans the Group, from top to bottom, for the nth member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
     * assigns `x` and `y`, and returns the member.
     *
     * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
     * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
     *
     * @method Phaser.GameObjects.Group#getFirstNth
     * @since 3.6.0
     *
     * @param {integer} nth - The nth matching Group member to search for.
     * @param {boolean} [state=false] - The {@link Phaser.GameObjects.GameObject#active} value to match.
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|integer)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?Phaser.GameObjects.GameObject} The first matching group member, or a newly created member, or null.
     */
    getFirstNth: function (nth, state, createIfNull, x, y, key, frame, visible)
    {
        return this.getHandler(true, nth, state, createIfNull, x, y, key, frame, visible);
    },

    /**
     * Scans the Group for the last member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
     * assigns `x` and `y`, and returns the member.
     *
     * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
     * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
     *
     * @method Phaser.GameObjects.Group#getLast
     * @since 3.6.0
     *
     * @param {boolean} [state=false] - The {@link Phaser.GameObjects.GameObject#active} value to match.
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|integer)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?Phaser.GameObjects.GameObject} The first matching group member, or a newly created member, or null.
     */
    getLast: function (state, createIfNull, x, y, key, frame, visible)
    {
        return this.getHandler(false, 1, state, createIfNull, x, y, key, frame, visible);
    },

    /**
     * Scans the Group for the last nth member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
     * assigns `x` and `y`, and returns the member.
     *
     * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
     * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
     *
     * @method Phaser.GameObjects.Group#getLastNth
     * @since 3.6.0
     *
     * @param {integer} nth - The nth matching Group member to search for.
     * @param {boolean} [state=false] - The {@link Phaser.GameObjects.GameObject#active} value to match.
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|integer)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?Phaser.GameObjects.GameObject} The first matching group member, or a newly created member, or null.
     */
    getLastNth: function (nth, state, createIfNull, x, y, key, frame, visible)
    {
        return this.getHandler(false, nth, state, createIfNull, x, y, key, frame, visible);
    },

    /**
     * Scans the group for the last member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
     * assigns `x` and `y`, and returns the member.
     *
     * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
     * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
     *
     * @method Phaser.GameObjects.Group#getHandler
     * @private
     * @since 3.6.0
     *
     * @param {boolean} forwards - Search front to back or back to front?
     * @param {integer} nth - Stop matching after nth successful matches.
     * @param {boolean} [state=false] - The {@link Phaser.GameObjects.GameObject#active} value to match.
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|integer)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?Phaser.GameObjects.GameObject} The first matching group member, or a newly created member, or null.
     */
    getHandler: function (forwards, nth, state, createIfNull, x, y, key, frame, visible)
    {
        if (state === undefined) { state = false; }
        if (createIfNull === undefined) { createIfNull = false; }

        var gameObject;

        var i;
        var total = 0;
        var children = this.children.entries;

        if (forwards)
        {
            for (i = 0; i < children.length; i++)
            {
                gameObject = children[i];

                if (gameObject.active === state)
                {
                    total++;

                    if (total === nth)
                    {
                        break;
                    }
                }
                else
                {
                    gameObject = null;
                }
            }
        }
        else
        {
            for (i = children.length - 1; i >= 0; i--)
            {
                gameObject = children[i];

                if (gameObject.active === state)
                {
                    total++;

                    if (total === nth)
                    {
                        break;
                    }
                }
                else
                {
                    gameObject = null;
                }
            }
        }

        if (gameObject)
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
     * Scans the group for the first member that has an {@link Phaser.GameObjects.GameObject#active} state set to `false`,
     * assigns `x` and `y`, and returns the member.
     *
     * If no inactive member is found and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
     * The new Game Object will have its active state set to `true`.
     * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
     *
     * @method Phaser.GameObjects.Group#get
     * @since 3.0.0
     *
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|integer)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?Phaser.GameObjects.GameObject} The first inactive group member, or a newly created member, or null.
     */
    get: function (x, y, key, frame, visible)
    {
        return this.getFirst(false, true, x, y, key, frame, visible);
    },

    /**
     * Scans the group for the first member that has an {@link Phaser.GameObjects.GameObject#active} state set to `true`,
     * assigns `x` and `y`, and returns the member.
     *
     * If no active member is found and `createIfNull` is `true` and the group isn't full then it will create a new one using `x`, `y`, `key`, `frame`, and `visible`.
     * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
     *
     * @method Phaser.GameObjects.Group#getFirstAlive
     * @since 3.0.0
     *
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|integer)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {Phaser.GameObjects.GameObject} The first active group member, or a newly created member, or null.
     */
    getFirstAlive: function (createIfNull, x, y, key, frame, visible)
    {
        return this.getFirst(true, createIfNull, x, y, key, frame, visible);
    },

    /**
     * Scans the group for the first member that has an {@link Phaser.GameObjects.GameObject#active} state set to `false`,
     * assigns `x` and `y`, and returns the member.
     *
     * If no inactive member is found and `createIfNull` is `true` and the group isn't full then it will create a new one using `x`, `y`, `key`, `frame`, and `visible`.
     * The new Game Object will have an active state set to `true`.
     * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
     *
     * @method Phaser.GameObjects.Group#getFirstDead
     * @since 3.0.0
     *
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|integer)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {Phaser.GameObjects.GameObject} The first inactive group member, or a newly created member, or null.
     */
    getFirstDead: function (createIfNull, x, y, key, frame, visible)
    {
        return this.getFirst(false, createIfNull, x, y, key, frame, visible);
    },

    /**
     * {@link Phaser.GameObjects.Components.Animation#play Plays} an animation for all members of this group.
     *
     * @method Phaser.GameObjects.Group#playAnimation
     * @since 3.0.0
     *
     * @param {string} key - The string-based key of the animation to play.
     * @param {string} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    playAnimation: function (key, startFrame)
    {
        Actions.PlayAnimation(this.children.entries, key, startFrame);

        return this;
    },

    /**
     * Whether this group's size at its {@link Phaser.GameObjects.Group#maxSize maximum}.
     *
     * @method Phaser.GameObjects.Group#isFull
     * @since 3.0.0
     *
     * @return {boolean} True if the number of members equals {@link Phaser.GameObjects.Group#maxSize}.
     */
    isFull: function ()
    {
        if (this.maxSize === -1)
        {
            return false;
        }
        else
        {
            return (this.children.size >= this.maxSize);
        }
    },

    /**
     * Counts the number of active (or inactive) group members.
     *
     * @method Phaser.GameObjects.Group#countActive
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - Count active (true) or inactive (false) group members.
     *
     * @return {integer} The number of group members with an active state matching the `active` argument.
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
     * Counts the number of in-use (active) group members.
     *
     * @method Phaser.GameObjects.Group#getTotalUsed
     * @since 3.0.0
     *
     * @return {integer} The number of group members with an active state of true.
     */
    getTotalUsed: function ()
    {
        return this.countActive();
    },

    /**
     * The difference of {@link Phaser.GameObjects.Group#maxSize} and the number of active group members.
     *
     * This represents the number of group members that could be created or reactivated before reaching the size limit.
     *
     * @method Phaser.GameObjects.Group#getTotalFree
     * @since 3.0.0
     *
     * @return {integer} maxSize minus the number of active group numbers; or a large number (if maxSize is -1).
     */
    getTotalFree: function ()
    {
        var used = this.getTotalUsed();
        var capacity = (this.maxSize === -1) ? 999999999999 : this.maxSize;

        return (capacity - used);
    },

    /**
     * Sets the depth of each group member.
     *
     * @method Phaser.GameObjects.Group#setDepth
     * @since 3.0.0
     *
     * @param {number} value - The amount to set the property to.
     * @param {number} step - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {Phaser.GameObjects.Group} This Group object.
     */
    setDepth: function (value, step)
    {
        Actions.SetDepth(this.children.entries, value, step);

        return this;
    },

    /**
     * Deactivates a member of this group.
     *
     * @method Phaser.GameObjects.Group#kill
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - A member of this group.
     */
    kill: function (gameObject)
    {
        if (this.children.contains(gameObject))
        {
            gameObject.setActive(false);
        }
    },

    /**
     * Deactivates and hides a member of this group.
     *
     * @method Phaser.GameObjects.Group#killAndHide
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - A member of this group.
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
     * Toggles (flips) the visible state of each member of this group.
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
     * Empties this group and removes it from the scene.
     *
     * Does not call {@link Phaser.GameObjects.Group#removeCallback}.
     *
     * @method Phaser.GameObjects.Group#destroy
     * @since 3.0.0
     *
     * @param {boolean} [destroyChildren=false] - Also {@link Phaser.GameObjects.GameObject#destroy} each group member.
     */
    destroy: function (destroyChildren)
    {
        if (destroyChildren === undefined) { destroyChildren = false; }

        if (destroyChildren)
        {
            var children = this.children;

            for (var i = 0; i < children.size; i++)
            {
                var gameObject = children.entries[i];

                //  Remove the event hook first or it'll go all recursive hell on us
                gameObject.off('destroy', this.remove, this);

                gameObject.destroy();
            }
        }

        this.children.clear();

        this.scene = undefined;
        this.children = undefined;
    }

});

module.exports = Group;
