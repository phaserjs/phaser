/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Actions = require('../../actions/');
var Class = require('../../utils/Class');
var Events = require('../events');
var EventEmitter = require('eventemitter3');
var GetAll = require('../../utils/array/GetAll');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var HasValue = require('../../utils/object/HasValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var Range = require('../../utils/array/Range');
var Set = require('../../structs/Set');
var Sprite = require('../sprite/Sprite');

/**
 * @classdesc
 * A Group is a way for you to create, manipulate, or recycle similar Game Objects.
 *
 * Group membership is non-exclusive. A Game Object can belong to several groups, one group, or none.
 *
 * Groups themselves aren't displayable, and can't be positioned, rotated, scaled, or hidden.
 *
 * @class Group
 * @memberof Phaser.GameObjects
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.0.0
 * @param {Phaser.Scene} scene - The scene this group belongs to.
 * @param {(Phaser.GameObjects.GameObject[]|Phaser.Types.GameObjects.Group.GroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig)} [children] - Game Objects to add to this group; or the `config` argument.
 * @param {Phaser.Types.GameObjects.Group.GroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig} [config] - Settings for this group. If `key` is set, Phaser.GameObjects.Group#createMultiple is also called with these settings.
 *
 * @see Phaser.Physics.Arcade.Group
 * @see Phaser.Physics.Arcade.StaticGroup
 */
var Group = new Class({

    Extends: EventEmitter,

    initialize:

    function Group (scene, children, config)
    {
        EventEmitter.call(this);

        //  They can pass in any of the following as the first argument:

        //  1) A single child
        //  2) An array of children
        //  3) A config object
        //  4) An array of config objects

        //  Or they can pass in a child, or array of children AND a config object

        if (config)
        {
            //  config has been set, are the children an array?

            if (children && !Array.isArray(children))
            {
                children = [ children ];
            }
        }
        else if (Array.isArray(children))
        {
            //  No config, so let's check the children argument

            if (IsPlainObject(children[0]))
            {
                //  It's an array of plain config objects
                config = children;
                children = null;
            }
        }
        else if (IsPlainObject(children))
        {
            //  Children isn't an array. Is it a config object though?
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
        this.children = new Set();

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
         * A textual representation of this Game Object.
         * Used internally by Phaser but is available for your own custom classes to populate.
         *
         * @name Phaser.GameObjects.Group#type
         * @type {string}
         * @default 'Group'
         * @since 3.21.0
         */
        this.type = 'Group';

        /**
         * The class to create new group members from.
         *
         * @name Phaser.GameObjects.Group#classType
         * @type {function}
         * @since 3.0.0
         * @default Phaser.GameObjects.Sprite
         * @see Phaser.Types.GameObjects.Group.GroupClassTypeConstructor
         */
        this.classType = GetFastValue(config, 'classType', Sprite);

        /**
         * The name of this group.
         * Empty by default and never populated by Phaser, this is left for developers to use.
         *
         * @name Phaser.GameObjects.Group#name
         * @type {string}
         * @default ''
         * @since 3.18.0
         */
        this.name = GetFastValue(config, 'name', '');

        /**
         * Whether this group runs its {@link Phaser.GameObjects.Group#preUpdate} method (which may update any members).
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
         * @type {number}
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
         * @type {(string|number)}
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
         * @type {?Phaser.Types.GameObjects.Group.GroupCallback}
         * @since 3.0.0
         */
        this.createCallback = GetFastValue(config, 'createCallback', null);

        /**
         * A function to be called when removing group members.
         *
         * @name Phaser.GameObjects.Group#removeCallback
         * @type {?Phaser.Types.GameObjects.Group.GroupCallback}
         * @since 3.0.0
         */
        this.removeCallback = GetFastValue(config, 'removeCallback', null);

        /**
         * A function to be called when creating several group members at once.
         *
         * @name Phaser.GameObjects.Group#createMultipleCallback
         * @type {?Phaser.Types.GameObjects.Group.GroupMultipleCreateCallback}
         * @since 3.0.0
         */
        this.createMultipleCallback = GetFastValue(config, 'createMultipleCallback', null);

        /**
         * A function to be called when adding or creating group members.
         * For internal use only by a Group, or any class that extends it.
         *
         * @name Phaser.GameObjects.Group#internalCreateCallback
         * @type {?Phaser.Types.GameObjects.Group.GroupCallback}
         * @private
         * @since 3.22.0
         */
        this.internalCreateCallback = GetFastValue(config, 'internalCreateCallback', null);

        /**
         * A function to be called when removing group members.
         * For internal use only by a Group, or any class that extends it.
         *
         * @name Phaser.GameObjects.Group#internalRemoveCallback
         * @type {?Phaser.Types.GameObjects.Group.GroupCallback}
         * @private
         * @since 3.22.0
         */
        this.internalRemoveCallback = GetFastValue(config, 'internalRemoveCallback', null);

        if (children)
        {
            this.addMultiple(children);
        }

        if (config)
        {
            this.createMultiple(config);
        }

        this.on(Events.ADDED_TO_SCENE, this.addedToScene, this);
        this.on(Events.REMOVED_FROM_SCENE, this.removedFromScene, this);
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
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
     * @param {(string|number)} [frame=defaultFrame] - The texture frame of the new Game Object.
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of the new Game Object.
     * @param {boolean} [active=true] - The {@link Phaser.GameObjects.GameObject#active} state of the new Game Object.
     *
     * @return {any} The new Game Object (usually a Sprite, etc.).
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

        child.addToDisplayList(this.scene.sys.displayList);
        child.addToUpdateList();

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
     * @param {Phaser.Types.GameObjects.Group.GroupCreateConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig[]} config - Creation settings. This can be a single configuration object or an array of such objects, which will be applied in turn.
     *
     * @return {any[]} The newly created Game Objects.
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

        var output = [];

        if (config[0].key)
        {
            for (var i = 0; i < config.length; i++)
            {
                var entries = this.createFromConfig(config[i]);

                output = output.concat(entries);
            }
        }

        return output;
    },

    /**
     * A helper for {@link Phaser.GameObjects.Group#createMultiple}.
     *
     * @method Phaser.GameObjects.Group#createFromConfig
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Group.GroupCreateConfig} options - Creation settings.
     *
     * @return {any[]} The newly created Game Objects.
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
        var quantity = GetFastValue(options, 'quantity', false);
        var frameQuantity = GetFastValue(options, 'frameQuantity', 1);
        var max = GetFastValue(options, 'max', 0);

        //  If a quantity value is set we use that to override the frameQuantity

        var range = Range(key, frame, {
            max: max,
            qty: (quantity) ? quantity : frameQuantity,
            random: randomKey,
            randomB: randomFrame,
            repeat: repeat,
            yoyo: yoyo
        });

        if (options.createCallback)
        {
            this.createCallback = options.createCallback;
        }

        if (options.removeCallback)
        {
            this.removeCallback = options.removeCallback;
        }

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

        if (HasValue(options, 'setXY'))
        {
            var x = GetValue(options, 'setXY.x', 0);
            var y = GetValue(options, 'setXY.y', 0);
            var stepX = GetValue(options, 'setXY.stepX', 0);
            var stepY = GetValue(options, 'setXY.stepY', 0);

            Actions.SetXY(entries, x, y, stepX, stepY);
        }

        if (HasValue(options, 'setRotation'))
        {
            var rotation = GetValue(options, 'setRotation.value', 0);
            var stepRotation = GetValue(options, 'setRotation.step', 0);

            Actions.SetRotation(entries, rotation, stepRotation);
        }

        if (HasValue(options, 'setScale'))
        {
            var scaleX = GetValue(options, 'setScale.x', 1);
            var scaleY = GetValue(options, 'setScale.y', scaleX);
            var stepScaleX = GetValue(options, 'setScale.stepX', 0);
            var stepScaleY = GetValue(options, 'setScale.stepY', 0);

            Actions.SetScale(entries, scaleX, scaleY, stepScaleX, stepScaleY);
        }

        if (HasValue(options, 'setOrigin'))
        {
            var originX = GetValue(options, 'setOrigin.x', 0.5);
            var originY = GetValue(options, 'setOrigin.y', originX);
            var stepOriginX = GetValue(options, 'setOrigin.stepX', 0);
            var stepOriginY = GetValue(options, 'setOrigin.stepY', 0);

            Actions.SetOrigin(entries, originX, originY, stepOriginX, stepOriginY);
        }

        if (HasValue(options, 'setAlpha'))
        {
            var alpha = GetValue(options, 'setAlpha.value', 1);
            var stepAlpha = GetValue(options, 'setAlpha.step', 0);

            Actions.SetAlpha(entries, alpha, stepAlpha);
        }

        if (HasValue(options, 'setDepth'))
        {
            var depth = GetValue(options, 'setDepth.value', 0);
            var stepDepth = GetValue(options, 'setDepth.step', 0);

            Actions.SetDepth(entries, depth, stepDepth);
        }

        if (HasValue(options, 'setScrollFactor'))
        {
            var scrollFactorX = GetValue(options, 'setScrollFactor.x', 1);
            var scrollFactorY = GetValue(options, 'setScrollFactor.y', scrollFactorX);
            var stepScrollFactorX = GetValue(options, 'setScrollFactor.stepX', 0);
            var stepScrollFactorY = GetValue(options, 'setScrollFactor.stepY', 0);

            Actions.SetScrollFactor(entries, scrollFactorX, scrollFactorY, stepScrollFactorX, stepScrollFactorY);
        }

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
     * @return {this} This Group object.
     */
    add: function (child, addToScene)
    {
        if (addToScene === undefined) { addToScene = false; }

        if (this.isFull())
        {
            return this;
        }

        this.children.set(child);

        if (this.internalCreateCallback)
        {
            this.internalCreateCallback.call(this, child);
        }

        if (this.createCallback)
        {
            this.createCallback.call(this, child);
        }

        if (addToScene)
        {
            child.addToDisplayList(this.scene.sys.displayList);
            child.addToUpdateList();
        }

        child.on(Events.DESTROY, this.remove, this);

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
     * @return {this} This group.
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
     * @return {this} This Group object.
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

        if (this.internalRemoveCallback)
        {
            this.internalRemoveCallback.call(this, child);
        }

        if (this.removeCallback)
        {
            this.removeCallback.call(this, child);
        }

        child.off(Events.DESTROY, this.remove, this);

        if (destroyChild)
        {
            child.destroy();
        }
        else if (removeFromScene)
        {
            child.removeFromDisplayList();
            child.removeFromUpdateList();
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
     * @return {this} This group.
     */
    clear: function (removeFromScene, destroyChild)
    {
        if (removeFromScene === undefined) { removeFromScene = false; }
        if (destroyChild === undefined) { destroyChild = false; }

        var children = this.children;

        for (var i = 0; i < children.size; i++)
        {
            var gameObject = children.entries[i];

            gameObject.off(Events.DESTROY, this.remove, this);

            if (destroyChild)
            {
                gameObject.destroy();
            }
            else if (removeFromScene)
            {
                gameObject.removeFromDisplayList();
                gameObject.removeFromUpdateList();
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
     * @return {number}
     */
    getLength: function ()
    {
        return this.children.size;
    },

    /**
     * Returns all children in this Group that match the given criteria based on the `property` and `value` arguments.
     *
     * For example: `getMatching('visible', true)` would return only children that have their `visible` property set.
     *
     * Optionally, you can specify a start and end index. For example if the Group has 100 elements,
     * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
     * the first 50.
     *
     * @method Phaser.GameObjects.Group#getMatching
     * @since 3.50.0
     *
     * @param {string} [property] - The property to test on each array element.
     * @param {*} [value] - The value to test the property against. Must pass a strict (`===`) comparison check.
     * @param {number} [startIndex] - An optional start index to search from.
     * @param {number} [endIndex] - An optional end index to search to.
     *
     * @return {any[]} An array of matching Group members. The array will be empty if nothing matched.
     */
    getMatching: function (property, value, startIndex, endIndex)
    {
        return GetAll(this.children.entries, property, value, startIndex, endIndex);
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
     * @param {(string|number)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?any} The first matching group member, or a newly created member, or null.
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
     * @param {number} nth - The nth matching Group member to search for.
     * @param {boolean} [state=false] - The {@link Phaser.GameObjects.GameObject#active} value to match.
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|number)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?any} The first matching group member, or a newly created member, or null.
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
     * @param {(string|number)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?any} The first matching group member, or a newly created member, or null.
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
     * @param {number} nth - The nth matching Group member to search for.
     * @param {boolean} [state=false] - The {@link Phaser.GameObjects.GameObject#active} value to match.
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|number)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?any} The first matching group member, or a newly created member, or null.
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
     * @param {number} nth - Stop matching after nth successful matches.
     * @param {boolean} [state=false] - The {@link Phaser.GameObjects.GameObject#active} value to match.
     * @param {boolean} [createIfNull=false] - Create a new Game Object if no matching members are found, using the following arguments.
     * @param {number} [x] - The horizontal position of the Game Object in the world.
     * @param {number} [y] - The vertical position of the Game Object in the world.
     * @param {string} [key=defaultKey] - The texture key assigned to a new Game Object (if one is created).
     * @param {(string|number)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?any} The first matching group member, or a newly created member, or null.
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
     * @param {(string|number)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {?any} The first inactive group member, or a newly created member, or null.
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
     * @param {(string|number)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {any} The first active group member, or a newly created member, or null.
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
     * @param {(string|number)} [frame=defaultFrame] - A texture frame assigned to a new Game Object (if one is created).
     * @param {boolean} [visible=true] - The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created).
     *
     * @return {any} The first inactive group member, or a newly created member, or null.
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
     * @return {this} This Group object.
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
     * @return {number} The number of group members with an active state matching the `active` argument.
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
     * @return {number} The number of group members with an active state of true.
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
     * @return {number} maxSize minus the number of active group numbers; or a large number (if maxSize is -1).
     */
    getTotalFree: function ()
    {
        var used = this.getTotalUsed();
        var capacity = (this.maxSize === -1) ? 999999999999 : this.maxSize;

        return (capacity - used);
    },

    /**
     * Sets the `active` property of this Group.
     * When active, this Group runs its `preUpdate` method.
     *
     * @method Phaser.GameObjects.Group#setActive
     * @since 3.24.0
     *
     * @param {boolean} value - True if this Group should be set as active, false if not.
     *
     * @return {this} This Group object.
     */
    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    /**
     * Sets the `name` property of this Group.
     * The `name` property is not populated by Phaser and is presented for your own use.
     *
     * @method Phaser.GameObjects.Group#setName
     * @since 3.24.0
     *
     * @param {string} value - The name to be given to this Group.
     *
     * @return {this} This Group object.
     */
    setName: function (value)
    {
        this.name = value;

        return this;
    },

    /**
     * Sets the property as defined in `key` of each group member to the given value.
     *
     * @method Phaser.GameObjects.Group#propertyValueSet
     * @since 3.21.0
     *
     * @param {string} key - The property to be updated.
     * @param {number} value - The amount to set the property to.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     * @param {number} [index=0] - An optional offset to start searching from within the items array.
     * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
     *
     * @return {this} This Group object.
     */
    propertyValueSet: function (key, value, step, index, direction)
    {
        Actions.PropertyValueSet(this.children.entries, key, value, step, index, direction);

        return this;
    },

    /**
     * Adds the given value to the property as defined in `key` of each group member.
     *
     * @method Phaser.GameObjects.Group#propertyValueInc
     * @since 3.21.0
     *
     * @param {string} key - The property to be updated.
     * @param {number} value - The amount to set the property to.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     * @param {number} [index=0] - An optional offset to start searching from within the items array.
     * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
     *
     * @return {this} This Group object.
     */
    propertyValueInc: function (key, value, step, index, direction)
    {
        Actions.PropertyValueInc(this.children.entries, key, value, step, index, direction);

        return this;
    },

    /**
     * Sets the x of each group member.
     *
     * @method Phaser.GameObjects.Group#setX
     * @since 3.21.0
     *
     * @param {number} value - The amount to set the property to.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    setX: function (value, step)
    {
        Actions.SetX(this.children.entries, value, step);

        return this;
    },

    /**
     * Sets the y of each group member.
     *
     * @method Phaser.GameObjects.Group#setY
     * @since 3.21.0
     *
     * @param {number} value - The amount to set the property to.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    setY: function (value, step)
    {
        Actions.SetY(this.children.entries, value, step);

        return this;
    },

    /**
     * Sets the x, y of each group member.
     *
     * @method Phaser.GameObjects.Group#setXY
     * @since 3.21.0
     *
     * @param {number} x - The amount to set the `x` property to.
     * @param {number} [y=x] - The amount to set the `y` property to. If `undefined` or `null` it uses the `x` value.
     * @param {number} [stepX=0] - This is added to the `x` amount, multiplied by the iteration counter.
     * @param {number} [stepY=0] - This is added to the `y` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    setXY: function (x, y, stepX, stepY)
    {
        Actions.SetXY(this.children.entries, x, y, stepX, stepY);

        return this;
    },

    /**
     * Adds the given value to the x of each group member.
     *
     * @method Phaser.GameObjects.Group#incX
     * @since 3.21.0
     *
     * @param {number} value - The amount to be added to the `x` property.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    incX: function (value, step)
    {
        Actions.IncX(this.children.entries, value, step);

        return this;
    },

    /**
     * Adds the given value to the y of each group member.
     *
     * @method Phaser.GameObjects.Group#incY
     * @since 3.21.0
     *
     * @param {number} value - The amount to be added to the `y` property.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    incY: function (value, step)
    {
        Actions.IncY(this.children.entries, value, step);

        return this;
    },

    /**
     * Adds the given value to the x, y of each group member.
     *
     * @method Phaser.GameObjects.Group#incXY
     * @since 3.21.0
     *
     * @param {number} x - The amount to be added to the `x` property.
     * @param {number} [y=x] - The amount to be added to the `y` property. If `undefined` or `null` it uses the `x` value.
     * @param {number} [stepX=0] - This is added to the `x` amount, multiplied by the iteration counter.
     * @param {number} [stepY=0] - This is added to the `y` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    incXY: function (x, y, stepX, stepY)
    {
        Actions.IncXY(this.children.entries, x, y, stepX, stepY);

        return this;
    },

    /**
     * Iterate through the group members changing the position of each element to be that of the element that came before
     * it in the array (or after it if direction = 1)
     *
     * The first group member position is set to x/y.
     *
     * @method Phaser.GameObjects.Group#shiftPosition
     * @since 3.21.0
     *
     * @param {number} x - The x coordinate to place the first item in the array at.
     * @param {number} y - The y coordinate to place the first item in the array at.
     * @param {number} [direction=0] - The iteration direction. 0 = first to last and 1 = last to first.
     *
     * @return {this} This Group object.
     */
    shiftPosition: function (x, y, direction)
    {
        Actions.ShiftPosition(this.children.entries, x, y, direction);

        return this;
    },

    /**
     * Sets the angle of each group member.
     *
     * @method Phaser.GameObjects.Group#angle
     * @since 3.21.0
     *
     * @param {number} value - The amount to set the angle to, in degrees.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    angle: function (value, step)
    {
        Actions.Angle(this.children.entries, value, step);

        return this;
    },

    /**
     * Sets the rotation of each group member.
     *
     * @method Phaser.GameObjects.Group#rotate
     * @since 3.21.0
     *
     * @param {number} value - The amount to set the rotation to, in radians.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    rotate: function (value, step)
    {
        Actions.Rotate(this.children.entries, value, step);

        return this;
    },

    /**
     * Rotates each group member around the given point by the given angle.
     *
     * @method Phaser.GameObjects.Group#rotateAround
     * @since 3.21.0
     *
     * @param {Phaser.Types.Math.Vector2Like} point - Any object with public `x` and `y` properties.
     * @param {number} angle - The angle to rotate by, in radians.
     *
     * @return {this} This Group object.
     */
    rotateAround: function (point, angle)
    {
        Actions.RotateAround(this.children.entries, point, angle);

        return this;
    },

    /**
     * Rotates each group member around the given point by the given angle and distance.
     *
     * @method Phaser.GameObjects.Group#rotateAroundDistance
     * @since 3.21.0
     *
     * @param {Phaser.Types.Math.Vector2Like} point - Any object with public `x` and `y` properties.
     * @param {number} angle - The angle to rotate by, in radians.
     * @param {number} distance - The distance from the point of rotation in pixels.
     *
     * @return {this} This Group object.
     */
    rotateAroundDistance: function (point, angle, distance)
    {
        Actions.RotateAroundDistance(this.children.entries, point, angle, distance);

        return this;
    },

    /**
     * Sets the alpha of each group member.
     *
     * @method Phaser.GameObjects.Group#setAlpha
     * @since 3.21.0
     *
     * @param {number} value - The amount to set the alpha to.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    setAlpha: function (value, step)
    {
        Actions.SetAlpha(this.children.entries, value, step);

        return this;
    },

    /**
     * Sets the tint of each group member.
     *
     * @method Phaser.GameObjects.Group#setTint
     * @since 3.21.0
     *
     * @param {number} topLeft - The tint being applied to top-left corner of item. If other parameters are given no value, this tint will be applied to whole item.
     * @param {number} [topRight] - The tint to be applied to top-right corner of item.
     * @param {number} [bottomLeft] - The tint to be applied to the bottom-left corner of item.
     * @param {number} [bottomRight] - The tint to be applied to the bottom-right corner of item.
     *
     * @return {this} This Group object.
     */
    setTint: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        Actions.SetTint(this.children.entries, topLeft, topRight, bottomLeft, bottomRight);

        return this;
    },

    /**
     * Sets the originX, originY of each group member.
     *
     * @method Phaser.GameObjects.Group#setOrigin
     * @since 3.21.0
     *
     * @param {number} originX - The amount to set the `originX` property to.
     * @param {number} [originY] - The amount to set the `originY` property to. If `undefined` or `null` it uses the `originX` value.
     * @param {number} [stepX=0] - This is added to the `originX` amount, multiplied by the iteration counter.
     * @param {number} [stepY=0] - This is added to the `originY` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    setOrigin: function (originX, originY, stepX, stepY)
    {
        Actions.SetOrigin(this.children.entries, originX, originY, stepX, stepY);

        return this;
    },

    /**
     * Sets the scaleX of each group member.
     *
     * @method Phaser.GameObjects.Group#scaleX
     * @since 3.21.0
     *
     * @param {number} value - The amount to set the property to.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    scaleX: function (value, step)
    {
        Actions.ScaleX(this.children.entries, value, step);

        return this;
    },

    /**
     * Sets the scaleY of each group member.
     *
     * @method Phaser.GameObjects.Group#scaleY
     * @since 3.21.0
     *
     * @param {number} value - The amount to set the property to.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    scaleY: function (value, step)
    {
        Actions.ScaleY(this.children.entries, value, step);

        return this;
    },

    /**
     * Sets the scaleX, scaleY of each group member.
     *
     * @method Phaser.GameObjects.Group#scaleXY
     * @since 3.21.0
     *
     * @param {number} scaleX - The amount to be added to the `scaleX` property.
     * @param {number} [scaleY] - The amount to be added to the `scaleY` property. If `undefined` or `null` it uses the `scaleX` value.
     * @param {number} [stepX=0] - This is added to the `scaleX` amount, multiplied by the iteration counter.
     * @param {number} [stepY=0] - This is added to the `scaleY` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    scaleXY: function (scaleX, scaleY, stepX, stepY)
    {
        Actions.ScaleXY(this.children.entries, scaleX, scaleY, stepX, stepY);

        return this;
    },

    /**
     * Sets the depth of each group member.
     *
     * @method Phaser.GameObjects.Group#setDepth
     * @since 3.0.0
     *
     * @param {number} value - The amount to set the property to.
     * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
     *
     * @return {this} This Group object.
     */
    setDepth: function (value, step)
    {
        Actions.SetDepth(this.children.entries, value, step);

        return this;
    },

    /**
     * Sets the blendMode of each group member.
     *
     * @method Phaser.GameObjects.Group#setBlendMode
     * @since 3.21.0
     *
     * @param {number} value - The amount to set the property to.
     *
     * @return {this} This Group object.
     */
    setBlendMode: function (value)
    {
        Actions.SetBlendMode(this.children.entries, value);

        return this;
    },

    /**
     * Passes all group members to the Input Manager to enable them for input with identical areas and callbacks.
     *
     * @method Phaser.GameObjects.Group#setHitArea
     * @since 3.21.0
     *
     * @param {*} hitArea - Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not specified a Rectangle will be used.
     * @param {Phaser.Types.Input.HitAreaCallback} hitAreaCallback - A callback to be invoked when the Game Object is interacted with. If you provide a shape you must also provide a callback.
     *
     * @return {this} This Group object.
     */
    setHitArea: function (hitArea, hitAreaCallback)
    {
        Actions.SetHitArea(this.children.entries, hitArea, hitAreaCallback);

        return this;
    },

    /**
     * Shuffles the group members in place.
     *
     * @method Phaser.GameObjects.Group#shuffle
     * @since 3.21.0
     *
     * @return {this} This Group object.
     */
    shuffle: function ()
    {
        Actions.Shuffle(this.children.entries);

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
     * Sets the visible of each group member.
     *
     * @method Phaser.GameObjects.Group#setVisible
     * @since 3.21.0
     *
     * @param {boolean} value - The value to set the property to.
     * @param {number} [index=0] - An optional offset to start searching from within the items array.
     * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
     *
     * @return {this} This Group object.
     */
    setVisible: function (value, index, direction)
    {
        Actions.SetVisible(this.children.entries, value, index, direction);

        return this;
    },

    /**
     * Toggles (flips) the visible state of each member of this group.
     *
     * @method Phaser.GameObjects.Group#toggleVisible
     * @since 3.0.0
     *
     * @return {this} This Group object.
     */
    toggleVisible: function ()
    {
        Actions.ToggleVisible(this.children.entries);

        return this;
    },

    /**
     * Empties this Group of all children and removes it from the Scene.
     *
     * Does not call {@link Phaser.GameObjects.Group#removeCallback}.
     *
     * Children of this Group will _not_ be removed from the Scene by calling this method
     * unless you specify the `removeFromScene` parameter.
     *
     * Children of this Group will also _not_ be destroyed by calling this method
     * unless you specify the `destroyChildren` parameter.
     *
     * @method Phaser.GameObjects.Group#destroy
     * @since 3.0.0
     *
     * @param {boolean} [destroyChildren=false] - Also {@link Phaser.GameObjects.GameObject#destroy} each Group member.
     * @param {boolean} [removeFromScene=false] - Optionally remove each Group member from the Scene.
     */
    destroy: function (destroyChildren, removeFromScene)
    {
        if (destroyChildren === undefined) { destroyChildren = false; }
        if (removeFromScene === undefined) { removeFromScene = false; }

        //  This Game Object had already been destroyed
        if (!this.scene || this.ignoreDestroy)
        {
            return;
        }

        this.emit(Events.DESTROY, this);

        this.removeAllListeners();

        this.scene.sys.updateList.remove(this);

        this.clear(removeFromScene, destroyChildren);

        this.scene = undefined;
        this.children = undefined;
    }

});

module.exports = Group;
