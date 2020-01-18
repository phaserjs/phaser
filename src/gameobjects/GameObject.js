/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var ComponentsToJSON = require('./components/ToJSON');
var DataManager = require('../data/DataManager');
var EventEmitter = require('eventemitter3');
var Events = require('./events');

/**
 * @classdesc
 * The base class that all Game Objects extend.
 * You don't create GameObjects directly and they cannot be added to the display list.
 * Instead, use them as the base for your own custom classes.
 *
 * @class GameObject
 * @memberof Phaser.GameObjects
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {string} type - A textual representation of the type of Game Object, i.e. `sprite`.
 */
var GameObject = new Class({

    Extends: EventEmitter,

    initialize:

    function GameObject (scene, type)
    {
        EventEmitter.call(this);

        /**
         * The Scene to which this Game Object belongs.
         * Game Objects can only belong to one Scene.
         *
         * @name Phaser.GameObjects.GameObject#scene
         * @type {Phaser.Scene}
         * @protected
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A textual representation of this Game Object, i.e. `sprite`.
         * Used internally by Phaser but is available for your own custom classes to populate.
         *
         * @name Phaser.GameObjects.GameObject#type
         * @type {string}
         * @since 3.0.0
         */
        this.type = type;

        /**
         * The current state of this Game Object.
         * 
         * Phaser itself will never modify this value, although plugins may do so.
         * 
         * Use this property to track the state of a Game Object during its lifetime. For example, it could change from
         * a state of 'moving', to 'attacking', to 'dead'. The state value should be an integer (ideally mapped to a constant
         * in your game code), or a string. These are recommended to keep it light and simple, with fast comparisons.
         * If you need to store complex data about your Game Object, look at using the Data Component instead.
         *
         * @name Phaser.GameObjects.GameObject#state
         * @type {(integer|string)}
         * @since 3.16.0
         */
        this.state = 0;

        /**
         * The parent Container of this Game Object, if it has one.
         *
         * @name Phaser.GameObjects.GameObject#parentContainer
         * @type {Phaser.GameObjects.Container}
         * @since 3.4.0
         */
        this.parentContainer = null;

        /**
         * The name of this Game Object.
         * Empty by default and never populated by Phaser, this is left for developers to use.
         *
         * @name Phaser.GameObjects.GameObject#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * The active state of this Game Object.
         * A Game Object with an active state of `true` is processed by the Scenes UpdateList, if added to it.
         * An active object is one which is having its logic and internal systems updated.
         *
         * @name Phaser.GameObjects.GameObject#active
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.active = true;

        /**
         * The Tab Index of the Game Object.
         * Reserved for future use by plugins and the Input Manager.
         *
         * @name Phaser.GameObjects.GameObject#tabIndex
         * @type {integer}
         * @default -1
         * @since 3.0.0
         */
        this.tabIndex = -1;

        /**
         * A Data Manager.
         * It allows you to store, query and get key/value paired information specific to this Game Object.
         * `null` by default. Automatically created if you use `getData` or `setData` or `setDataEnabled`.
         *
         * @name Phaser.GameObjects.GameObject#data
         * @type {Phaser.Data.DataManager}
         * @default null
         * @since 3.0.0
         */
        this.data = null;

        /**
         * The flags that are compared against `RENDER_MASK` to determine if this Game Object will render or not.
         * The bits are 0001 | 0010 | 0100 | 1000 set by the components Visible, Alpha, Transform and Texture respectively.
         * If those components are not used by your custom class then you can use this bitmask as you wish.
         *
         * @name Phaser.GameObjects.GameObject#renderFlags
         * @type {integer}
         * @default 15
         * @since 3.0.0
         */
        this.renderFlags = 15;

        /**
         * A bitmask that controls if this Game Object is drawn by a Camera or not.
         * Not usually set directly, instead call `Camera.ignore`, however you can
         * set this property directly using the Camera.id property:
         *
         * @example
         * this.cameraFilter |= camera.id
         *
         * @name Phaser.GameObjects.GameObject#cameraFilter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.cameraFilter = 0;

        /**
         * If this Game Object is enabled for input then this property will contain an InteractiveObject instance.
         * Not usually set directly. Instead call `GameObject.setInteractive()`.
         *
         * @name Phaser.GameObjects.GameObject#input
         * @type {?Phaser.Types.Input.InteractiveObject}
         * @default null
         * @since 3.0.0
         */
        this.input = null;

        /**
         * If this Game Object is enabled for physics then this property will contain a reference to a Physics Body.
         *
         * @name Phaser.GameObjects.GameObject#body
         * @type {?(object|Phaser.Physics.Arcade.Body|Phaser.Physics.Impact.Body)}
         * @default null
         * @since 3.0.0
         */
        this.body = null;

        /**
         * This Game Object will ignore all calls made to its destroy method if this flag is set to `true`.
         * This includes calls that may come from a Group, Container or the Scene itself.
         * While it allows you to persist a Game Object across Scenes, please understand you are entirely
         * responsible for managing references to and from this Game Object.
         *
         * @name Phaser.GameObjects.GameObject#ignoreDestroy
         * @type {boolean}
         * @default false
         * @since 3.5.0
         */
        this.ignoreDestroy = false;

        //  Tell the Scene to re-sort the children
        scene.sys.queueDepthSort();
    },

    /**
     * Sets the `active` property of this Game Object and returns this Game Object for further chaining.
     * A Game Object with its `active` property set to `true` will be updated by the Scenes UpdateList.
     *
     * @method Phaser.GameObjects.GameObject#setActive
     * @since 3.0.0
     *
     * @param {boolean} value - True if this Game Object should be set as active, false if not.
     *
     * @return {this} This GameObject.
     */
    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    /**
     * Sets the `name` property of this Game Object and returns this Game Object for further chaining.
     * The `name` property is not populated by Phaser and is presented for your own use.
     *
     * @method Phaser.GameObjects.GameObject#setName
     * @since 3.0.0
     *
     * @param {string} value - The name to be given to this Game Object.
     *
     * @return {this} This GameObject.
     */
    setName: function (value)
    {
        this.name = value;

        return this;
    },

    /**
     * Sets the current state of this Game Object.
     * 
     * Phaser itself will never modify the State of a Game Object, although plugins may do so.
     * 
     * For example, a Game Object could change from a state of 'moving', to 'attacking', to 'dead'.
     * The state value should typically be an integer (ideally mapped to a constant
     * in your game code), but could also be a string. It is recommended to keep it light and simple.
     * If you need to store complex data about your Game Object, look at using the Data Component instead.
     *
     * @method Phaser.GameObjects.GameObject#setState
     * @since 3.16.0
     *
     * @param {(integer|string)} value - The state of the Game Object.
     *
     * @return {this} This GameObject.
     */
    setState: function (value)
    {
        this.state = value;

        return this;
    },

    /**
     * Adds a Data Manager component to this Game Object.
     *
     * @method Phaser.GameObjects.GameObject#setDataEnabled
     * @since 3.0.0
     * @see Phaser.Data.DataManager
     *
     * @return {this} This GameObject.
     */
    setDataEnabled: function ()
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        return this;
    },

    /**
     * Allows you to store a key value pair within this Game Objects Data Manager.
     *
     * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
     * before setting the value.
     *
     * If the key doesn't already exist in the Data Manager then it is created.
     *
     * ```javascript
     * sprite.setData('name', 'Red Gem Stone');
     * ```
     *
     * You can also pass in an object of key value pairs as the first argument:
     *
     * ```javascript
     * sprite.setData({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 });
     * ```
     *
     * To get a value back again you can call `getData`:
     *
     * ```javascript
     * sprite.getData('gold');
     * ```
     *
     * Or you can access the value directly via the `values` property, where it works like any other variable:
     *
     * ```javascript
     * sprite.data.values.gold += 50;
     * ```
     *
     * When the value is first set, a `setdata` event is emitted from this Game Object.
     *
     * If the key already exists, a `changedata` event is emitted instead, along an event named after the key.
     * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata-PlayerLives`.
     * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
     *
     * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.GameObjects.GameObject#setData
     * @since 3.0.0
     *
     * @param {(string|object)} key - The key to set the value for. Or an object of key value pairs. If an object the `data` argument is ignored.
     * @param {*} [data] - The value to set for the given key. If an object is provided as the key this argument is ignored.
     *
     * @return {this} This GameObject.
     */
    setData: function (key, value)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        this.data.set(key, value);

        return this;
    },

    /**
     * Retrieves the value for the given key in this Game Objects Data Manager, or undefined if it doesn't exist.
     *
     * You can also access values via the `values` object. For example, if you had a key called `gold` you can do either:
     *
     * ```javascript
     * sprite.getData('gold');
     * ```
     *
     * Or access the value directly:
     *
     * ```javascript
     * sprite.data.values.gold;
     * ```
     *
     * You can also pass in an array of keys, in which case an array of values will be returned:
     *
     * ```javascript
     * sprite.getData([ 'gold', 'armor', 'health' ]);
     * ```
     *
     * This approach is useful for destructuring arrays in ES6.
     *
     * @method Phaser.GameObjects.GameObject#getData
     * @since 3.0.0
     *
     * @param {(string|string[])} key - The key of the value to retrieve, or an array of keys.
     *
     * @return {*} The value belonging to the given key, or an array of values, the order of which will match the input array.
     */
    getData: function (key)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        return this.data.get(key);
    },

    /**
     * Pass this Game Object to the Input Manager to enable it for Input.
     *
     * Input works by using hit areas, these are nearly always geometric shapes, such as rectangles or circles, that act as the hit area
     * for the Game Object. However, you can provide your own hit area shape and callback, should you wish to handle some more advanced
     * input detection.
     *
     * If no arguments are provided it will try and create a rectangle hit area based on the texture frame the Game Object is using. If
     * this isn't a texture-bound object, such as a Graphics or BitmapText object, this will fail, and you'll need to provide a specific
     * shape for it to use.
     *
     * You can also provide an Input Configuration Object as the only argument to this method.
     *
     * @method Phaser.GameObjects.GameObject#setInteractive
     * @since 3.0.0
     *
     * @param {(Phaser.Types.Input.InputConfiguration|any)} [shape] - Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not specified a Rectangle will be used.
     * @param {Phaser.Types.Input.HitAreaCallback} [callback] - A callback to be invoked when the Game Object is interacted with. If you provide a shape you must also provide a callback.
     * @param {boolean} [dropZone=false] - Should this Game Object be treated as a drop zone target?
     *
     * @return {this} This GameObject.
     */
    setInteractive: function (shape, callback, dropZone)
    {
        this.scene.sys.input.enable(this, shape, callback, dropZone);

        return this;
    },

    /**
     * If this Game Object has previously been enabled for input, this will disable it.
     *
     * An object that is disabled for input stops processing or being considered for
     * input events, but can be turned back on again at any time by simply calling
     * `setInteractive()` with no arguments provided.
     *
     * If want to completely remove interaction from this Game Object then use `removeInteractive` instead.
     *
     * @method Phaser.GameObjects.GameObject#disableInteractive
     * @since 3.7.0
     *
     * @return {this} This GameObject.
     */
    disableInteractive: function ()
    {
        if (this.input)
        {
            this.input.enabled = false;
        }

        return this;
    },

    /**
     * If this Game Object has previously been enabled for input, this will queue it
     * for removal, causing it to no longer be interactive. The removal happens on
     * the next game step, it is not immediate.
     *
     * The Interactive Object that was assigned to this Game Object will be destroyed,
     * removed from the Input Manager and cleared from this Game Object.
     *
     * If you wish to re-enable this Game Object at a later date you will need to
     * re-create its InteractiveObject by calling `setInteractive` again.
     *
     * If you wish to only temporarily stop an object from receiving input then use
     * `disableInteractive` instead, as that toggles the interactive state, where-as
     * this erases it completely.
     * 
     * If you wish to resize a hit area, don't remove and then set it as being
     * interactive. Instead, access the hitarea object directly and resize the shape
     * being used. I.e.: `sprite.input.hitArea.setSize(width, height)` (assuming the
     * shape is a Rectangle, which it is by default.)
     *
     * @method Phaser.GameObjects.GameObject#removeInteractive
     * @since 3.7.0
     *
     * @return {this} This GameObject.
     */
    removeInteractive: function ()
    {
        this.scene.sys.input.clear(this);

        this.input = undefined;

        return this;
    },

    /**
     * To be overridden by custom GameObjects. Allows base objects to be used in a Pool.
     *
     * @method Phaser.GameObjects.GameObject#update
     * @since 3.0.0
     *
     * @param {...*} [args] - args
     */
    update: function ()
    {
    },

    /**
     * Returns a JSON representation of the Game Object.
     *
     * @method Phaser.GameObjects.GameObject#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        return ComponentsToJSON(this);
    },

    /**
     * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
     * Also checks the Game Object against the given Cameras exclusion list.
     *
     * @method Phaser.GameObjects.GameObject#willRender
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to check against this Game Object.
     *
     * @return {boolean} True if the Game Object should be rendered, otherwise false.
     */
    willRender: function (camera)
    {
        return !(GameObject.RENDER_MASK !== this.renderFlags || (this.cameraFilter !== 0 && (this.cameraFilter & camera.id)));
    },

    /**
     * Returns an array containing the display list index of either this Game Object, or if it has one,
     * its parent Container. It then iterates up through all of the parent containers until it hits the
     * root of the display list (which is index 0 in the returned array).
     *
     * Used internally by the InputPlugin but also useful if you wish to find out the display depth of
     * this Game Object and all of its ancestors.
     *
     * @method Phaser.GameObjects.GameObject#getIndexList
     * @since 3.4.0
     *
     * @return {integer[]} An array of display list position indexes.
     */
    getIndexList: function ()
    {
        // eslint-disable-next-line consistent-this
        var child = this;
        var parent = this.parentContainer;

        var indexes = [];

        while (parent)
        {
            // indexes.unshift([parent.getIndex(child), parent.name]);
            indexes.unshift(parent.getIndex(child));

            child = parent;

            if (!parent.parentContainer)
            {
                break;
            }
            else
            {
                parent = parent.parentContainer;
            }
        }

        // indexes.unshift([this.scene.sys.displayList.getIndex(child), 'root']);
        indexes.unshift(this.scene.sys.displayList.getIndex(child));

        return indexes;
    },

    /**
     * Destroys this Game Object removing it from the Display List and Update List and
     * severing all ties to parent resources.
     *
     * Also removes itself from the Input Manager and Physics Manager if previously enabled.
     *
     * Use this to remove a Game Object from your game if you don't ever plan to use it again.
     * As long as no reference to it exists within your own code it should become free for
     * garbage collection by the browser.
     *
     * If you just want to temporarily disable an object then look at using the
     * Game Object Pool instead of destroying it, as destroyed objects cannot be resurrected.
     *
     * @method Phaser.GameObjects.GameObject#destroy
     * @fires Phaser.GameObjects.Events#DESTROY
     * @since 3.0.0
     *
     * @param {boolean} [fromScene=false] - Is this Game Object being destroyed as the result of a Scene shutdown?
     */
    destroy: function (fromScene)
    {
        if (fromScene === undefined) { fromScene = false; }

        //  This Game Object has already been destroyed
        if (!this.scene || this.ignoreDestroy)
        {
            return;
        }

        if (this.preDestroy)
        {
            this.preDestroy.call(this);
        }

        this.emit(Events.DESTROY, this);

        var sys = this.scene.sys;

        if (!fromScene)
        {
            sys.displayList.remove(this);
            sys.updateList.remove(this);
        }

        if (this.input)
        {
            sys.input.clear(this);
            this.input = undefined;
        }

        if (this.data)
        {
            this.data.destroy();

            this.data = undefined;
        }

        if (this.body)
        {
            this.body.destroy();
            this.body = undefined;
        }

        //  Tell the Scene to re-sort the children
        if (!fromScene)
        {
            sys.queueDepthSort();
        }

        this.active = false;
        this.visible = false;

        this.scene = undefined;

        this.parentContainer = undefined;

        this.removeAllListeners();
    }

});

/**
 * The bitmask that `GameObject.renderFlags` is compared against to determine if the Game Object will render or not.
 *
 * @constant {integer} RENDER_MASK
 * @memberof Phaser.GameObjects.GameObject
 * @default
 */
GameObject.RENDER_MASK = 15;

module.exports = GameObject;
